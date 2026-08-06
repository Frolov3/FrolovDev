"use client"

import { Music } from "@/app/types/letter"
import {
	type CSSProperties,
	type SVGProps,
	useEffect,
	useRef,
	useState,
} from "react"
import {
	LeftArrowIcon,
	PauseIcon,
	PlayIcon,
	RightArrowIcon,
	SoundMax,
	SoundMin,
	SoundMute,
} from "./icons/AudioPlayerIcon"

const iconClass =
	"text-[var(--white)] transition-all duration-300 hover:opacity-75 cursor-pointer"

function getRangeStyle(value: number, max: number): CSSProperties {
	const progress =
		max > 0 ? Math.min(100, Math.max(0, (value / max) * 100)) : 0

	return {
		"--range-progress": `${progress}%`,
	} as CSSProperties
}

function getAudioSrc(path: string) {
	if (/^https?:\/\//i.test(path)) {
		return path
	}

	return path.startsWith("/") ? path : `/${path}`
}

function SoundIcon({
	volume = 0,
	...props
}: {
	volume: number
} & SVGProps<SVGSVGElement>) {
	if (volume >= 51) return <SoundMax {...props} />
	if (volume >= 1) return <SoundMin {...props} />
	return <SoundMute {...props} />
}

export default function AudioPlayer({ musics = [] }: { musics: Music[] }) {
	const audioRef = useRef<HTMLAudioElement | null>(null)

	const [currentIndex, setCurrentIndex] = useState(0)
	const currentMusic = musics[currentIndex] ?? null

	const [volume, setVolume] = useState(50)
	const [isPlay, setIsPlay] = useState(false)

	const [currentTime, setCurrentTime] = useState(0)
	const [duration, setDuration] = useState(0)

	const [showVolume, setShowVolume] = useState(false)

	useEffect(() => {
		if (!audioRef.current || !currentMusic) return

		audioRef.current.src = getAudioSrc(currentMusic.path)
		setCurrentTime(0)
		setDuration(0)
	}, [currentMusic])

	useEffect(() => {
		if (!audioRef.current) return
		audioRef.current.volume = volume / 100
	}, [volume])

	useEffect(() => {
		if (!audioRef.current) return

		if (isPlay) {
			void audioRef.current.play()
		} else {
			audioRef.current.pause()
		}
	}, [currentMusic, isPlay])

	useEffect(() => {
		const audio = audioRef.current

		if (!audio) return

		const updateTime = () => {
			setCurrentTime(audio.currentTime)
		}

		const loaded = () => {
			setDuration(audio.duration)
		}

		audio.addEventListener("timeupdate", updateTime)
		audio.addEventListener("loadedmetadata", loaded)

		return () => {
			audio.removeEventListener("timeupdate", updateTime)
			audio.removeEventListener("loadedmetadata", loaded)
		}
	}, [])

	const changeVolume = (value: number) => {
		setVolume(value)

		if (audioRef.current) {
			audioRef.current.volume = value / 100
		}
	}

	const switchVolumeHandler = () => {
		if (volume <= 50) {
			changeVolume(50)
		}
		if (volume >= 50) {
			changeVolume(100)
		}
		if (volume === 100) {
			changeVolume(0)
		}
	}

	const seekTrack = (e: React.ChangeEvent<HTMLInputElement>) => {
		const time = Number(e.target.value)

		setCurrentTime(time)

		if (audioRef.current) {
			audioRef.current.currentTime = time
		}
	}

	const nextTrack = () => {
		if (!musics.length) return

		setCurrentIndex((prev) => (prev >= musics.length - 1 ? 0 : prev + 1))
	}

	const previewTrack = () => {
		if (!musics.length) return

		setCurrentIndex((prev) => (prev <= 0 ? musics.length - 1 : prev - 1))
	}

	const playHandler = () => {
		if (!audioRef.current) return

		if (isPlay) {
			setIsPlay(false)
		} else {
			setIsPlay(true)
		}
	}

	const formatTime = (time: number) => {
		if (!time) return "0:00"

		const min = Math.floor(time / 60)
		const sec = Math.floor(time % 60)

		return `${min}:${sec.toString().padStart(2, "0")}`
	}

	return (
		<div className="fixed left-1/2 bottom-4 z-50 flex w-[min(18rem,calc(100vw-2rem))] -translate-x-1/2 flex-col gap-3 rounded-2xl bg-[var(--black)] p-3.5 shadow-2xl">
			<audio ref={audioRef} />

			<div className="flex justify-between items-center">
				<div className="min-w-0 truncate text-white">
					{currentMusic?.title}
				</div>

				<div
					className="group relative flex items-center justify-end pl-2"
					onMouseEnter={() => setShowVolume(true)}
					onMouseLeave={() => setShowVolume(false)}
					onFocus={() => setShowVolume(true)}
					onBlur={(e) => {
						if (!e.currentTarget.contains(e.relatedTarget)) {
							setShowVolume(false)
						}
					}}
				>
					<SoundIcon
						volume={volume}
						className={iconClass}
						onClick={switchVolumeHandler}
					/>

					{showVolume && (
						<div className="absolute right-5 top-1/2 -translate-y-1/2 rounded-xl bg-black p-2">
							<input
								type="range"
								min="0"
								max="100"
								value={volume}
								style={getRangeStyle(volume, 100)}
								onChange={(e) =>
									changeVolume(Number(e.target.value))
								}
								className="audio-player-range w-24"
								aria-label="Громкость"
							/>
						</div>
					)}
				</div>
			</div>

			<div className="flex items-center gap-2 text-xs text-white">
				<span>{formatTime(currentTime)}</span>

				<input
					type="range"
					min="0"
					max={duration || 0}
					value={currentTime}
					style={getRangeStyle(currentTime, duration)}
					onChange={seekTrack}
					className="audio-player-range flex-1"
					aria-label="Позиция трека"
				/>

				<span>{formatTime(duration)}</span>
			</div>

			<div className="flex justify-between items-center">
				<button onClick={previewTrack}>
					<LeftArrowIcon className={iconClass} />
				</button>

				<button onClick={playHandler}>
					{isPlay ? (
						<PauseIcon className={iconClass} />
					) : (
						<PlayIcon className={iconClass} />
					)}
				</button>

				<button onClick={nextTrack}>
					<RightArrowIcon className={iconClass} />
				</button>
			</div>
		</div>
	)
}
