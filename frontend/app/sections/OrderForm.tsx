"use client"

import { useEffect, useRef, useState } from "react"

import ArrowIcon from "../components/icons/ArrowIcon"
import MediaViewer from "../components/MediaViewer"

type Option = {
	id: number
	title: string
}

type Props = {
	budgets: Option[]
	projectTypes: Option[]
	deadlines: Option[]
}

type NoticeProps = {
	message: string
	onExited: () => void
}

type AttachedFile = {
	id: string
	file: File
	url: string
}

const MAX_FILES = 10
const MAX_FILE_SIZE = 25 * 1024 * 1024
const ACCEPTED_FILE_TYPES =
	".jpg,.jpeg,.png,.webp,.pdf,.zip,.fig,.txt,.md,.doc,.docx"

function formatFileSize(size: number) {
	if (size < 1024 * 1024) {
		return `${Math.max(1, Math.round(size / 1024))} КБ`
	}

	return `${(size / 1024 / 1024).toFixed(1)} МБ`
}

function SwipeNotice({ message, onExited }: NoticeProps) {
	const [offsetX, setOffsetX] = useState(0)
	const [isClosing, setIsClosing] = useState(false)
	const startXRef = useRef<number | null>(null)

	useEffect(() => {
		const timeoutId = window.setTimeout(() => {
			setIsClosing(true)
		}, 5000)

		return () => window.clearTimeout(timeoutId)
	}, [])

	useEffect(() => {
		if (!isClosing) {
			return
		}

		const timeoutId = window.setTimeout(onExited, 320)

		return () => window.clearTimeout(timeoutId)
	}, [isClosing, onExited])

	function closeNotice() {
		setIsClosing(true)
	}

	function handlePointerDown(e: React.PointerEvent<HTMLDivElement>) {
		if ((e.target as HTMLElement).closest("button")) {
			return
		}

		startXRef.current = e.clientX
		e.currentTarget.setPointerCapture(e.pointerId)
	}

	function handlePointerMove(e: React.PointerEvent<HTMLDivElement>) {
		if (startXRef.current === null) {
			return
		}

		setOffsetX(Math.max(0, Math.min(e.clientX - startXRef.current, 240)))
	}

	function handlePointerUp() {
		if (offsetX > 120) {
			closeNotice()
			return
		}

		startXRef.current = null
		setOffsetX(0)
	}

	return (
		<div
			className="fixed right-6 top-6 z-50 w-[min(24rem,calc(100vw-3rem))] cursor-grab active:cursor-grabbing rounded-lg border border-[var(--white)]/15 bg-[var(--white)] px-5 py-4 text-[var(--black)] shadow-[0_20px_80px_rgba(0,0,0,0.2)] transition-[transform,opacity] duration-300 ease-out"
			onPointerDown={handlePointerDown}
			onPointerMove={handlePointerMove}
			onPointerUp={handlePointerUp}
			onPointerCancel={handlePointerUp}
			style={{
				transform: `translate3d(${offsetX + (isClosing ? 24 : 0)}px, 0, 0)`,
				opacity: isClosing ? 0 : 1 - offsetX / 320,
				touchAction: "pan-y",
			}}
		>
			<div className="flex items-start justify-between gap-4">
				<div>
					<div className="mt-2 text-sm leading-6">{message}</div>
				</div>
				<button
					type="button"
					onPointerDown={(e) => e.stopPropagation()}
					onClick={(e) => {
						e.stopPropagation()
						closeNotice()
					}}
					className="text-xl leading-none opacity-50 cursor-pointer transition-opacity duration-300 hover:opacity-100"
					aria-label="Закрыть уведомление"
				>
					×
				</button>
			</div>
		</div>
	)
}

export default function OrderForm({ budgets, projectTypes, deadlines }: Props) {
	const formRef = useRef<HTMLFormElement>(null)
	const fileInputRef = useRef<HTMLInputElement>(null)
	const attachedFilesRef = useRef<AttachedFile[]>([])
	const [isSubmitting, setIsSubmitting] = useState(false)
	const [noticeMessage, setNoticeMessage] = useState<string | null>(null)
	const [attachedFiles, setAttachedFiles] = useState<AttachedFile[]>([])
	const [isViewerOpen, setIsViewerOpen] = useState<boolean>(false)
	const [selectedMediaIndex, setSelectedMediaIndex] = useState<number>(0)

	useEffect(() => {
		attachedFilesRef.current = attachedFiles
	}, [attachedFiles])

	useEffect(() => {
		return () => {
			attachedFilesRef.current.forEach((item) =>
				URL.revokeObjectURL(item.url),
			)
		}
	}, [])

	const mediaItems = attachedFiles
		.filter(({ file }) => file.type.startsWith("image/"))
		.map(({ file, url }) => ({
			type: "image" as const,
			url,
			name: file.name,
			alt: file.name,
		}))

	function addFiles(fileList: FileList | null) {
		if (!fileList) {
			return
		}

		const files = Array.from(fileList)
		const freeSlots = MAX_FILES - attachedFiles.length

		if (freeSlots <= 0) {
			setNoticeMessage("Можно прикрепить максимум 10 файлов.")
			return
		}

		const validFiles = files
			.slice(0, freeSlots)
			.filter((file) => file.size <= MAX_FILE_SIZE)

		if (files.length > freeSlots) {
			setNoticeMessage("Добавил первые 10 файлов. Лимит вложений - 10.")
		}

		if (validFiles.length !== Math.min(files.length, freeSlots)) {
			setNoticeMessage("Файлы больше 25 МБ не добавлены.")
		}

		setAttachedFiles((currentFiles) => [
			...currentFiles,
			...validFiles.map((file) => ({
				id: `${file.name}-${file.lastModified}-${crypto.randomUUID()}`,
				file,
				url: URL.createObjectURL(file),
			})),
		])

		if (fileInputRef.current) {
			fileInputRef.current.value = ""
		}
	}

	function removeFile(id: string) {
		setAttachedFiles((currentFiles) => {
			const removedFile = currentFiles.find((item) => item.id === id)

			if (removedFile) {
				URL.revokeObjectURL(removedFile.url)
			}

			return currentFiles.filter((item) => item.id !== id)
		})
	}

	async function formHandler(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault()

		const formData = new FormData(e.currentTarget)
		const orderData = new FormData()

		orderData.append("projectTypeId", String(formData.get("type") || ""))
		orderData.append("contact", String(formData.get("contacts") || ""))
		orderData.append("task", String(formData.get("task") || ""))
		orderData.append("budgetId", String(formData.get("budget") || ""))
		orderData.append("urgencyId", String(formData.get("deadlines") || ""))

		attachedFiles.forEach(({ file }) => {
			orderData.append("files", file)
		})

		setIsSubmitting(true)

		try {
			const res = await fetch("/api/order", {
				method: "POST",
				body: orderData,
			})

			if (!res.ok) {
				throw new Error("Request failed")
			}

			formRef.current?.reset()
			attachedFiles.forEach((item) => URL.revokeObjectURL(item.url))
			setAttachedFiles([])
			setNoticeMessage(
				"Заявка на создание проекта отправлена. Скоро с вами свяжусь.",
			)
		} catch {
			setNoticeMessage(
				"Не удалось отправить заявку. Попробуйте ещё раз чуть позже.",
			)
		} finally {
			setIsSubmitting(false)
		}
	}

	const optionClassName = `border border-[var(--white)] px-2.5 py-1 text-xs text-[var(--white)] 
	peer-checked:bg-[var(--white)] peer-checked:text-[var(--black)] 
	peer-checked:hover:text-[var(--black)] peer-checked:hover:bg-[var(--white)]/50 peer-checked:hover:border-[var(--white)]/50 
	peer-checked:focus-visible:text-[var(--black)] peer-checked:focus-visible:bg-[var(--white)]/50 peer-checked:focus-visible:border-[var(--white)]/50 
	hover:border-[var(--white)]/50 hover:text-[var(--white)]/50 
	focus-visible:border-[var(--white)]/50 focus-visible:text-[var(--white)]/50 outline-none
	duration-300`

	return (
		<>
			{noticeMessage ? (
				<SwipeNotice
					message={noticeMessage}
					onExited={() => setNoticeMessage(null)}
				/>
			) : null}
			<form
				ref={formRef}
				onSubmit={formHandler}
				method="POST"
				className="grid w-full grid-cols-1 gap-12 mt-10 lg:grid-cols-[minmax(0,1fr)_minmax(22rem,0.8fr)] lg:gap-16 lg:mt-12"
			>
				<div className="flex flex-col">
					<div>
						<div className="text-[var(--white)] text-base mb-4">
							Тип проекта
						</div>
						<div className="flex flex-wrap gap-3 sm:gap-4">
							{projectTypes
								?.sort(
									(
										a: { id: number; title: string },
										b: { id: number; title: string },
									) => a.id - b.id,
								)
								.map(
									(option: { id: number; title: string }) => (
										<label
											key={option.id}
											className="cursor-pointer"
										>
											<input
												type="radio"
												name="type"
												value={option.id}
												className="hidden peer"
											/>
											<div
												tabIndex={0}
												className={optionClassName}
												onKeyDown={(e) => {
													if (
														e.key === "Enter" ||
														e.key === " "
													) {
														e.preventDefault()
														const input = e
															.currentTarget
															.previousElementSibling as HTMLInputElement
														input.click()
													}
												}}
											>
												{option.title}
											</div>
										</label>
									),
								)}
						</div>
					</div>
					<input
						type="text"
						placeholder="Telegram / Email"
						name="contacts"
						required
						className="mt-10 lg:mt-12 border-b border-[var(--white)] text-[var(--white)] placeholder:text-[var(--white)] placeholder:text-base outline-none focus:border-[var(--white)]/50 pb-1.5 duration-300"
					/>
					<textarea
						name="task"
						placeholder="Опишите задачу..."
						required
						className="border-b border-[var(--white)] h-24 resize-none text-[var(--white)] placeholder:text-[var(--white)] placeholder:text-base mt-10 lg:mt-12 pb-1.5 outline-none focus:border-[var(--white)]/50 duration-300"
					></textarea>
					<div className="mt-10 lg:mt-12">
						<div className="text-[var(--white)] text-base mb-4">
							Бюджет
						</div>
						<div className="flex flex-wrap gap-3 sm:gap-4">
							{budgets
								?.sort(
									(
										a: { id: number; title: string },
										b: { id: number; title: string },
									) => a.id - b.id,
								)
								.map(
									(option: { id: number; title: string }) => (
										<label
											key={option.id}
											className="cursor-pointer"
										>
											<input
												type="radio"
												name="budget"
												value={option.id}
												className="hidden peer"
											/>
											<div
												tabIndex={0}
												className={optionClassName}
												onKeyDown={(e) => {
													if (
														e.key === "Enter" ||
														e.key === " "
													) {
														e.preventDefault()
														const input = e
															.currentTarget
															.previousElementSibling as HTMLInputElement
														input.click()
													}
												}}
											>
												{option.title}
											</div>
										</label>
									),
								)}
						</div>
					</div>
					<div className="mt-10 lg:mt-12">
						<div className="text-[var(--white)] text-base mb-4">
							Срочность
						</div>
						<div className="flex flex-wrap gap-3 sm:gap-4">
							{deadlines
								?.sort(
									(
										a: { id: number; title: string },
										b: { id: number; title: string },
									) => a.id - b.id,
								)
								.map(
									(option: { id: number; title: string }) => (
										<label
											key={option.id}
											className="cursor-pointer"
										>
											<input
												type="radio"
												name="deadlines"
												value={option.id}
												className="hidden peer"
											/>
											<div
												tabIndex={0}
												className={optionClassName}
												onKeyDown={(e) => {
													if (
														e.key === "Enter" ||
														e.key === " "
													) {
														e.preventDefault()
														const input = e
															.currentTarget
															.previousElementSibling as HTMLInputElement
														input.click()
													}
												}}
											>
												{option.title}
											</div>
										</label>
									),
								)}
						</div>
					</div>
				</div>

				<div className="flex flex-col">
					<div className="text-[var(--white)] text-base mb-4">
						Файлы к заказу
					</div>
					<label
						className="flex min-h-40 cursor-pointer flex-col items-center justify-center border border-dashed border-[var(--white)]/60 px-4 py-8 text-center text-[var(--white)] transition-colors duration-300 hover:border-[var(--white)] hover:bg-[var(--white)]/5 sm:px-6"
						onDragOver={(e) => e.preventDefault()}
						onDrop={(e) => {
							e.preventDefault()
							addFiles(e.dataTransfer.files)
						}}
					>
						<input
							ref={fileInputRef}
							type="file"
							name="files"
							accept={ACCEPTED_FILE_TYPES}
							multiple
							className="hidden"
							onChange={(e) => addFiles(e.target.files)}
						/>
						<span className="text-base font-semibold">
							Прикрепить ТЗ, макеты, фото или скрины
						</span>
						<span className="mt-3 text-sm leading-6 text-[var(--white)]/60">
							Перетащите файлы сюда или нажмите для выбора.
							<br />
							До 10 файлов, каждый до 25 МБ.
						</span>
					</label>

					<div className="mt-5 flex flex-col gap-2 text-xs text-[var(--white)]/60 sm:flex-row sm:items-center sm:justify-between">
						<span>
							{attachedFiles.length} из {MAX_FILES} файлов
						</span>
						<span>jpg, png, webp, pdf, zip, fig, docx, md</span>
					</div>

					{attachedFiles.length > 0 ? (
						<div className="mt-4 flex max-h-64 flex-col gap-3 overflow-y-auto pr-1">
							{attachedFiles.map(({ id, file, url }) => (
								<div
									key={id}
									className="grid grid-cols-[3rem_minmax(0,1fr)] items-center gap-3 border border-[var(--white)]/15 p-3 text-[var(--white)] sm:grid-cols-[3rem_minmax(0,1fr)_auto]"
								>
									<div className="flex h-12 w-12 items-center justify-center overflow-hidden border border-[var(--white)]/15 bg-[var(--white)]/5 text-xs uppercase text-[var(--white)]/60">
										{file.type.startsWith("image/") ? (
											<div
												aria-hidden="true"
												className="h-full w-full bg-cover bg-center"
												style={{
													backgroundImage: `url(${url})`,
												}}
											/>
										) : (
											file.name.split(".").pop() || "file"
										)}
									</div>
									<div className="min-w-0">
										<div className="truncate text-sm">
											{file.name}
										</div>
										<div className="mt-1 text-xs text-[var(--white)]/50">
											{formatFileSize(file.size)}
										</div>
									</div>
									<div className="col-span-2 flex flex-wrap items-center gap-2 sm:col-span-1">
										{file.type.startsWith("image/") ? (
											<button
												type="button"
												className="border border-[var(--white)]/35 px-2.5 py-1 text-xs text-[var(--white)] transition-colors duration-300 hover:border-[var(--white)] hover:bg-[var(--white)] hover:text-[var(--black)] focus:border-[var(--white)] focus:bg-[var(--white)] focus:text-[var(--black)] focus:outline-0 cursor-pointer"
												onClick={() => {
													const imageIndex =
														mediaItems.findIndex(
															(item) =>
																item.url ===
																url,
														)

													setSelectedMediaIndex(
														imageIndex,
													)
													setIsViewerOpen(true)
												}}
											>
												Просмотр
											</button>
										) : (
											""
										)}
										<button
											type="button"
											onClick={() => removeFile(id)}
											className="border border-[var(--white)]/35 px-2.5 py-1 text-xs text-[var(--white)] transition-colors duration-300 hover:border-[var(--white)] hover:bg-[var(--white)] hover:text-[var(--black)] focus:border-[var(--white)] focus:bg-[var(--white)] focus:text-[var(--black)] focus:outline-0 cursor-pointer"
										>
											Убрать
										</button>
									</div>
								</div>
							))}
						</div>
					) : (
						""
					)}
				</div>

				<button
					type="submit"
					disabled={isSubmitting}
					className="bg-[var(--white)] border-2 border-[var(--white)] flex items-center justify-center gap-3 p-3 w-full sm:w-fit sm:min-w-64 cursor-pointer group outline-none focus:bg-transparent hover:bg-transparent disabled:opacity-60 disabled:cursor-wait duration-300 lg:col-span-2"
				>
					<div className="text-[var(--black)] font-semi text-base group-hover:text-[var(--white)] group-focus:text-[var(--white)] duration-300">
						{isSubmitting ? "Отправляем..." : "Отправить заявку"}
					</div>
					<ArrowIcon className="text-[var(--black)] size-6 group-hover:text-[var(--white)] group-focus:text-[var(--white)] group-hover:-rotate-45 group-focus:-rotate-45 duration-300" />
				</button>
			</form>
			<MediaViewer
				open={isViewerOpen}
				onClose={() => setIsViewerOpen(false)}
				startIndex={selectedMediaIndex}
				items={mediaItems}
			/>
		</>
	)
}
