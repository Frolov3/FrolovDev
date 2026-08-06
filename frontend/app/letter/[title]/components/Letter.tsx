"use client"
import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from "react"
import {
	motion,
	useMotionValue,
	useTransform,
	useReducedMotion,
	animate,
} from "framer-motion"
import { sendLetterLog } from "@/app/lib/letterLog"
import type { LetterButton } from "@/app/types/letter"
import { ChevronLeftIcon, ChevronRightIcon } from "./icons/ChevronIcon"
import FeatherIcon from "./icons/FeatherIcon"

type LetterPage = string[]

interface EnvelopeLetterProps {
	pages?: LetterPage[]
	title?: string
	buttons?: LetterButton[]
}

const SCENE_W = 300
const SCENE_H = 420

const ENVELOPE_TOP = 230
const ENVELOPE_H = SCENE_H - ENVELOPE_TOP
const FLAP_H = 92
const POCKET_H = Math.round(ENVELOPE_H * 0.62)

const LETTER_W = SCENE_W - 40
const LETTER_CLOSED_H = 186
const LETTER_OPEN_H = 318
const LETTER_RISE = 205
const PAGE_CHAR_LIMIT = 300

const GRAIN_URL =
	"data:image/svg+xml;utf8," +
	encodeURIComponent(
		`<svg xmlns='http://www.w3.org/2000/svg' width='120' height='120'>
      <filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/></filter>
      <rect width='100%' height='100%' filter='url(#n)'/>
    </svg>`,
	)

function splitParagraph(paragraph: string, limit: number) {
	const chunks: string[] = []
	let rest = paragraph.trim()

	while (rest.length > limit) {
		const slice = rest.slice(0, limit + 1)
		const sentenceBreak = Math.max(
			slice.lastIndexOf(". "),
			slice.lastIndexOf("! "),
			slice.lastIndexOf("? "),
			slice.lastIndexOf("; "),
		)
		const wordBreak = slice.lastIndexOf(" ")
		const breakAt =
			sentenceBreak > limit * 0.45
				? sentenceBreak + 1
				: wordBreak > limit * 0.35
					? wordBreak
					: limit

		chunks.push(rest.slice(0, breakAt).trim())
		rest = rest.slice(breakAt).trim()
	}

	if (rest) chunks.push(rest)
	return chunks
}

function paginateLetterPages(pages: LetterPage[]) {
	const result: LetterPage[] = []

	for (const sourcePage of pages) {
		let current: string[] = []
		let currentLength = 0

		function flush() {
			if (!current.length) return
			result.push(current)
			current = []
			currentLength = 0
		}

		for (const rawParagraph of sourcePage) {
			const paragraph = rawParagraph.trim()
			if (!paragraph) continue

			const chunks = splitParagraph(paragraph, PAGE_CHAR_LIMIT)
			for (const chunk of chunks) {
				const gap = current.length ? 24 : 0
				if (
					current.length &&
					currentLength + chunk.length + gap > PAGE_CHAR_LIMIT
				) {
					flush()
				}

				current.push(chunk)
				currentLength += chunk.length + gap
			}
		}

		flush()
	}

	return result.length ? result : [[]]
}

export default function EnvelopeLetter({
	pages = [],
	title,
	buttons = [],
}: EnvelopeLetterProps) {
	const [opened, setOpened] = useState(false)
	const [page, setPage] = useState(0)
	const [pageTransitioning, setPageTransitioning] = useState(false)
	const [letterInFront, setLetterInFront] = useState(false)
	const [selectedButtonId, setSelectedButtonId] = useState<number | null>(
		null,
	)
	const prefersReducedMotion = useReducedMotion()

	const paginatedPages = useMemo(() => paginateLetterPages(pages), [pages])
	const totalPages = paginatedPages.length
	const activePage = Math.min(page, totalPages - 1)
	const currentPage = paginatedPages[activePage] ?? []
	const isLastPage = activePage === totalPages - 1
	const hasButtons = buttons.length > 0

	const progress = useMotionValue(0)
	const flapRotate = useMotionValue(0)

	const y = useTransform(progress, [0, 1], [0, -LETTER_RISE])
	const rotateX = useTransform(progress, [0, 1], [10, 0])
	const scale = useTransform(progress, [0, 1], [0.96, 1])
	const letterHeight = useTransform(
		progress,
		[0, 1],
		[LETTER_CLOSED_H, LETTER_OPEN_H],
	)
	const shadowOpacity = useTransform(progress, [0, 0.35, 1], [0, 0.32, 0.14])
	const shadowScale = useTransform(progress, [0, 0.35, 1], [0.6, 1.1, 1.4])
	const shadowBlur = useTransform(progress, [0, 1], [4, 18])

	const revealTriggered = useRef(false)
	const pageViewLogged = useRef(false)

	useEffect(() => {
		if (pageViewLogged.current) return
		pageViewLogged.current = true

		sendLetterLog({
			action: "Переход на страницу письма",
			url: window.location.href,
			title,
			page: activePage + 1,
			totalPages,
		})
	}, [activePage, title, totalPages])

	useEffect(() => {
		const dur = prefersReducedMotion ? 0 : undefined
		const flapSpring = {
			type: prefersReducedMotion
				? ("tween" as const)
				: ("spring" as const),
			stiffness: 95,
			damping: 15,
			duration: dur,
		}
		const letterSpring = {
			type: prefersReducedMotion
				? ("tween" as const)
				: ("spring" as const),
			stiffness: 78,
			damping: 15,
			mass: 1,
			duration: dur,
		}

		if (!opened) {
			revealTriggered.current = false
			animate(flapRotate, 0, flapSpring)
			animate(progress, 0, letterSpring)
			return
		}

		animate(flapRotate, -158, flapSpring)

		if (prefersReducedMotion) {
			const frame = requestAnimationFrame(() => setLetterInFront(true))
			animate(progress, 1, letterSpring)
			return () => cancelAnimationFrame(frame)
		}

		const unsubscribe = flapRotate.on("change", (v) => {
			if (!revealTriggered.current && v <= -70) {
				revealTriggered.current = true
				setLetterInFront(true)
				animate(progress, 1, letterSpring)
			}
		})
		return () => unsubscribe()
	}, [opened, prefersReducedMotion])

	function openLetter() {
		if (opened) return
		setOpened(true)
		sendLetterLog({
			action: "Открыто письмо",
			url: window.location.href,
			title,
			page: activePage + 1,
			totalPages,
			content: currentPage.join("\n\n"),
		})
	}

	function handleSealKeyDown(e: KeyboardEvent<HTMLButtonElement>) {
		if (e.key === "Enter" || e.key === " ") {
			e.preventDefault()
			openLetter()
		}
	}

	function goToPage(next: number) {
		if (
			next < 0 ||
			next >= totalPages ||
			next === activePage ||
			pageTransitioning
		)
			return
		setPageTransitioning(true)
		sendLetterLog({
			action: `Переход на страницу ${next + 1}`,
			url: window.location.href,
			title,
			page: next + 1,
			totalPages,
			content: (paginatedPages[next] ?? []).join("\n\n"),
		})
		setTimeout(() => {
			setPage(next)
			setPageTransitioning(false)
		}, 160)
	}

	function chooseButton(button: LetterButton) {
		if (selectedButtonId !== null) return

		setSelectedButtonId(button.id)
		sendLetterLog({
			action: `Выбрана кнопка: ${button.text}`,
			url: window.location.href,
			title,
			page: activePage + 1,
			totalPages,
			buttonText: button.text,
		})
	}

	return (
		<div className="flex justify-center py-32">
			<div
				className="relative"
				style={{ width: SCENE_W, height: SCENE_H, perspective: 1100 }}
			>
				<motion.div
					className="absolute rounded-full bg-black pointer-events-none"
					style={{
						left: SCENE_W / 2,
						top: ENVELOPE_TOP + 14,
						width: 200,
						height: 26,
						translateX: "-50%",
						opacity: shadowOpacity,
						scale: shadowScale,
						filter: useTransform(shadowBlur, (b) => `blur(${b}px)`),
						zIndex: 6,
					}}
				/>

				<div
					className="absolute left-0"
					style={{
						top: ENVELOPE_TOP,
						width: SCENE_W,
						height: ENVELOPE_H,
					}}
				>
					<div
						className="absolute inset-0 "
						style={{
							background:
								"linear-gradient(180deg, #e7c78c 0%, #ddb571 55%, #d2a45c 100%)",
							boxShadow:
								"inset 0 0 0 1px rgba(120,80,30,0.25), 0 4px 10px rgba(60,40,10,0.18)",
							zIndex: 1,
						}}
					/>

					<div
						className="absolute inset-0 pointer-events-none"
						style={{
							background: "#ddb571",
							zIndex: 3,
						}}
					/>

					<div
						className="absolute left-1 right-1 rounded-t-sm pointer-events-none"
						style={{
							top: 2,
							height: 30,
							background:
								"linear-gradient(180deg, rgba(60,38,14,0.35) 0%, rgba(60,38,14,0) 100%)",
							zIndex: 2,
						}}
					/>

					<motion.div
						className="absolute left-5 rounded-md p-[18px_20px_44px] box-border text-[18px] leading-[1.28] text-[#3a3226] overflow-hidden"
						style={{
							top: 2,
							width: LETTER_W,
							height: letterHeight,
							fontFamily: '"Caveat", cursive',
							fontWeight: 500,
							background: "#fdf8ec",
							border: "0.5px solid #d8cba8",
							y,
							rotateX,
							scale,
							transformPerspective: 900,
							zIndex: letterInFront ? 25 : 3,
							boxShadow:
								"0 10px 24px -8px rgba(60,40,10,0.35), 0 2px 6px rgba(60,40,10,0.15)",
						}}
					>
						<div
							className="absolute inset-0 pointer-events-none mix-blend-multiply opacity-[0.05]"
							style={{
								backgroundImage: `url("${GRAIN_URL}")`,
								backgroundSize: "140px 140px",
							}}
						/>

						<div
							className={`relative transition-opacity text-justify duration-150 motion-reduce:transition-none ${
								pageTransitioning ? "opacity-0" : "opacity-100"
							}`}
						>
							{currentPage.map((paragraph, i) => (
								<p
									key={i}
									className={
										i === 0
											? "mt-0 mb-3"
											: "mt-0 mb-3 last:mb-0"
									}
								>
									{paragraph}
								</p>
							))}

							{isLastPage && hasButtons && (
								<div className="mt-4 text-left">
									<div className="flex flex-row flex-wrap gap-2">
										{buttons.map((button) => {
											const isSelected =
												button.id === selectedButtonId
											const isMuted =
												selectedButtonId !== null &&
												!isSelected

											return (
												<button
													key={button.id}
													type="button"
													onClick={() =>
														chooseButton(button)
													}
													disabled={
														selectedButtonId !==
														null
													}
													className={`min-w-0 flex-1 rounded-md border px-3 py-1.5 text-center text-[15px] leading-tight transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8f2320] ${
														isSelected
															? "border-[#8f2320] bg-[#8f2320] text-[#fff8e9]"
															: isMuted
																? "border-[#d8cba8] bg-[#efe4c9] text-[#9f9074] opacity-55"
																: "cursor-pointer border-[#c7a15f] bg-[#f2dfb7] text-[#7a211d] hover:bg-[#ead19c]"
													}`}
												>
													{button.text}
												</button>
											)
										})}
									</div>
								</div>
							)}
						</div>

						{totalPages > 1 && (
							<div className="absolute left-0 right-0 bottom-0 flex items-center justify-between px-3 pb-1">
								<button
									type="button"
									onClick={() => goToPage(activePage - 1)}
									disabled={activePage === 0}
									aria-label="Предыдущая страница"
									className="flex items-center justify-center w-8 h-8 rounded-full text-[#8f2320] disabled:text-[#d8cba8] disabled:cursor-not-allowed hover:bg-[#f1e6c8] active:bg-[#e9dab0] transition-colors cursor-pointer"
								>
									<ChevronLeftIcon />
								</button>

								<div className="flex items-center gap-1.5">
									{paginatedPages.map((_, i) => (
										<button
											key={i}
											type="button"
											onClick={() => goToPage(i)}
											aria-label={`Страница ${i + 1} из ${totalPages}`}
											aria-current={i === activePage}
											className={`w-1.5 h-1.5 rounded-full transition-colors cursor-pointer ${
												i === activePage
													? "bg-[#8f2320]"
													: "bg-[#d8cba8]"
											}`}
										/>
									))}
								</div>

								<button
									type="button"
									onClick={() => goToPage(activePage + 1)}
									disabled={activePage === totalPages - 1}
									aria-label="Следующая страница"
									className="flex items-center justify-center w-8 h-8 rounded-full text-[#8f2320] disabled:text-[#d8cba8] disabled:cursor-not-allowed hover:bg-[#f1e6c8] active:bg-[#e9dab0] transition-colors cursor-pointer"
								>
									<ChevronRightIcon />
								</button>
							</div>
						)}
					</motion.div>
					<div
						className="absolute pointer-events-none"
						style={{
							left: 0,
							top: -1,
							width: SCENE_W / 2 + 4,
							height: ENVELOPE_H + 2,
							background:
								"linear-gradient(100deg, #ecd19c 0%, #e2bd7e 45%, #d6a860 100%)",
							clipPath: "polygon(0 0, 0 100%, 104% 50%)",
							zIndex: 4,
							boxShadow: "inset 0 0 12px rgba(60,38,14,0.12)",
						}}
					/>
					<div
						className="absolute pointer-events-none"
						style={{
							right: 0,
							top: -1,
							width: SCENE_W / 2 + 4,
							height: ENVELOPE_H + 2,
							background:
								"linear-gradient(260deg, #ecd19c 0%, #e2bd7e 45%, #d6a860 100%)",
							clipPath: "polygon(100% 0, 100% 100%, -4% 50%)",
							zIndex: 4,
							boxShadow: "inset 0 0 12px rgba(60,38,14,0.12)",
						}}
					/>

					<div
						className="absolute left-0 pointer-events-none"
						style={{
							bottom: 0,
							width: SCENE_W,
							height: POCKET_H + 3,
							background:
								"linear-gradient(0deg, #eccf95 0%, #e0b978 55%, #d8ab63 100%)",
							clipPath: "polygon(0 100%, 100% 100%, 50% 0)",
							zIndex: 5,
							boxShadow: "inset 0 2px 3px rgba(60,40,10,0.12)",
						}}
					/>
				</div>

				<motion.div
					className="absolute left-0"
					style={{
						top: ENVELOPE_TOP,
						width: SCENE_W,
						height: FLAP_H + 4,
						background:
							"linear-gradient(160deg, #f1d79a 0%, #dba955 100%)",
						clipPath: "polygon(0 -2px, 100% -2px, 50% 104%)",
						transformOrigin: "top center",
						transformPerspective: 900,
						rotateX: flapRotate,
						zIndex: 20,
						boxShadow: "0 2px 4px rgba(60,40,10,0.15)",
					}}
				>
					<div
						className="absolute inset-0"
						style={{
							background: "rgba(60,38,14,0.14)",
							mixBlendMode: "multiply",
						}}
					/>
				</motion.div>

				<motion.button
					type="button"
					onClick={openLetter}
					onKeyDown={handleSealKeyDown}
					aria-label="Открыть письмо"
					className="absolute w-11 h-11 rounded-full cursor-pointer flex items-center justify-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8f2320]"
					style={{
						left: SCENE_W / 2,
						top: ENVELOPE_TOP + FLAP_H,
						x: "-50%",
						y: "-50%",
						zIndex: 30,
						pointerEvents: opened ? "none" : "auto",
						background:
							"radial-gradient(circle at 34% 30%, #b8362f 0%, #942521 42%, #6f1815 100%)",
					}}
					animate={
						opened
							? {
									scale: 0.6,
									opacity: 0,
									boxShadow: "0 0 0 0 rgba(143,35,32,0)",
								}
							: prefersReducedMotion
								? {
										scale: 1,
										opacity: 1,
										boxShadow:
											"inset 0 -3px 5px rgba(0,0,0,0.35), inset 0 2px 3px rgba(255,180,160,0.25), 0 3px 6px rgba(60,20,10,0.4)",
									}
								: {
										scale: [1, 1.07, 1],
										opacity: 1,
										boxShadow: [
											"inset 0 -3px 5px rgba(0,0,0,0.35), inset 0 2px 3px rgba(255,180,160,0.25), 0 3px 6px rgba(60,20,10,0.4), 0 0 0 0 rgba(143,35,32,0.45)",
											"inset 0 -3px 5px rgba(0,0,0,0.35), inset 0 2px 3px rgba(255,180,160,0.25), 0 3px 6px rgba(60,20,10,0.4), 0 0 0 9px rgba(143,35,32,0)",
											"inset 0 -3px 5px rgba(0,0,0,0.35), inset 0 2px 3px rgba(255,180,160,0.25), 0 3px 6px rgba(60,20,10,0.4), 0 0 0 0 rgba(143,35,32,0)",
										],
									}
					}
					transition={
						opened
							? { duration: 0.3 }
							: {
									duration: 2.2,
									repeat: Infinity,
									ease: "easeInOut",
								}
					}
				>
					<div
						className="absolute inset-0 rounded-full pointer-events-none opacity-40"
						style={{
							background:
								"radial-gradient(circle at 65% 70%, rgba(0,0,0,0.28) 0%, rgba(0,0,0,0) 35%), radial-gradient(circle at 25% 75%, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0) 30%)",
						}}
					/>
					<FeatherIcon className="relative text-[#e6b6ac]" />
				</motion.button>
			</div>
		</div>
	)
}
