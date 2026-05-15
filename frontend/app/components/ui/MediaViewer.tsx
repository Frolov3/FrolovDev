"use client"
import { useEffect } from "react"
import ClientPortal from "./ClientPortal"

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
		if (!open) {
			return
		}

		document.documentElement.classList.add("overflow-hidden")
		document.body.classList.add("overflow-hidden")

		return () => {
			document.documentElement.classList.remove("overflow-hidden")
			document.body.classList.remove("overflow-hidden")
		}
	}, [open])

	if (!open || items.length === 0) return null

	return (
		<ClientPortal>
			<MediaViewerContent
				items={items}
				onClose={onClose}
				startIndex={startIndex}
			/>
		</ClientPortal>
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
	const lastIndex = items.length - 1
	const safeIndex = Math.min(Math.max(startIndex, 0), Math.max(lastIndex, 0))
	const current = items[safeIndex]

	useEffect(() => {
		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key === "Escape") {
				onClose()
			}
		}

		window.addEventListener("keydown", handleKeyDown)

		return () => {
			window.removeEventListener("keydown", handleKeyDown)
		}
	}, [onClose])

	return (
		<div
			className="fixed inset-0 z-[999] flex h-dvh w-screen items-center justify-center overflow-hidden px-3 py-4 sm:px-8 sm:py-8"
			role="dialog"
			aria-modal="true"
			aria-label="Просмотр фото"
		>
			<div className="absolute inset-0 bg-black/85" onClick={onClose} />
			<button
				type="button"
				onClick={onClose}
				className="absolute right-3 top-3 z-30 border border-[var(--white)] bg-[var(--black)] px-3 py-2 text-xs text-[var(--white)] transition-colors duration-300 hover:border-[var(--white)] hover:bg-[var(--white)] hover:text-[var(--black)] focus:border-[var(--white)] focus:bg-[var(--white)] focus:text-[var(--black)] focus:outline-0 sm:right-6 sm:top-6 cursor-pointer"
			>
				Закрыть
			</button>

			<div className="relative z-10 flex h-full min-h-0 w-full max-w-7xl items-center justify-center px-0 pt-12 sm:px-14 sm:py-12">
				{current?.url ? (
					<img
						src={current.url}
						alt={current.alt || current.name || "Фото"}
						className="max-h-full max-w-full object-contain"
					/>
				) : null}
			</div>
		</div>
	)
}

export default MediaViewer
