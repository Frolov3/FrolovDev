"use client"

import { useCallback, useEffect, useState } from "react"

type MediaItem = {
	type?: "image" | "video"
	url?: string
	preview?: string
	name?: string
	alt?: string
}

type MediaViewerProps = {
	open: boolean
	onClose: () => void
	items?: MediaItem[]
	startIndex?: number
}

const MediaViewer = ({
	open,
	onClose,
	items = [],
	startIndex = 0,
}: MediaViewerProps) => {
	useEffect(() => {
		if (open) {
			document.documentElement.classList.add("overflow-hidden")
		} else {
			document.documentElement.classList.remove("overflow-hidden")
		}

		return () => {
			document.documentElement.classList.remove("overflow-hidden")
		}
	}, [open])

	if (!open) return null

	return (
		<MediaViewerContent
			items={items}
			onClose={onClose}
			startIndex={startIndex}
		/>
	)
}

type MediaViewerContentProps = {
	items: MediaItem[]
	onClose: () => void
	startIndex: number
}

const MediaViewerContent = ({
	items,
	onClose,
	startIndex,
}: MediaViewerContentProps) => {
	const [activeIndex, setActiveIndex] = useState(startIndex)

	const lastIndex = items.length - 1
	const safeIndex = Math.min(Math.max(activeIndex, 0), Math.max(lastIndex, 0))
	const current = items[safeIndex]
	const hasManyItems = items.length > 1

	const showPrevious = useCallback(() => {
		setActiveIndex((index) => (index === 0 ? lastIndex : index - 1))
	}, [lastIndex])

	const showNext = useCallback(() => {
		setActiveIndex((index) => (index === lastIndex ? 0 : index + 1))
	}, [lastIndex])

	useEffect(() => {
		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key === "Escape") {
				onClose()
			}

			if (!hasManyItems) return

			if (event.key === "ArrowLeft") {
				showPrevious()
			}

			if (event.key === "ArrowRight") {
				showNext()
			}
		}

		window.addEventListener("keydown", handleKeyDown)

		return () => {
			window.removeEventListener("keydown", handleKeyDown)
		}
	}, [hasManyItems, onClose, showNext, showPrevious])

	return (
		<div
			className="fixed inset-0 z-[999] flex items-center justify-center px-4 py-5 sm:px-8"
			role="dialog"
			aria-modal="true"
		>
			<div className="absolute inset-0 bg-black/70" onClick={onClose} />
			<button
				type="button"
				onClick={onClose}
				className="absolute z-20 top-5 right-5 bg-[var(--black)] border border-[var(--white)] px-2.5 py-1 text-xs text-[var(--white)] transition-colors duration-300 hover:border-[var(--white)] hover:bg-[var(--white)] hover:text-[var(--black)] focus:border-[var(--white)] focus:bg-[var(--white)] focus:text-[var(--black)] focus:outline-0 cursor-pointer"
			>
				Закрыть
			</button>
			<div className="relative z-10 flex h-full w-full max-w-7xl items-center justify-center">
				<img
					src={current.url}
					alt={current.alt}
					className="max-h-full max-w-full object-contain"
				/>
			</div>
		</div>
	)
}

export default MediaViewer
