"use client"

import { useEffect, useRef, useState } from "react"

import ArrowIcon from "../components/icons/ArrowIcon"

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
	const [isSubmitting, setIsSubmitting] = useState(false)
	const [noticeMessage, setNoticeMessage] = useState<string | null>(null)

	async function formHandler(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault()

		const formData = new FormData(e.currentTarget)

		setIsSubmitting(true)

		try {
			const res = await fetch("/api/order", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					projectTypeId: formData.get("type"),
					contact: formData.get("contacts"),
					task: formData.get("task"),
					budgetId: formData.get("budget"),
					urgencyId: formData.get("deadlines"),
				}),
			})

			if (!res.ok) {
				throw new Error("Request failed")
			}

			formRef.current?.reset()
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
				className="flex flex-col w-1/2 mt-12"
			>
				<div>
					<div className="text-[var(--white)] text-base mb-4">
						Тип проекта
					</div>
					<div className="flex gap-4">
						{projectTypes
							?.sort(
								(
									a: { id: number; title: string },
									b: { id: number; title: string },
								) => a.id - b.id,
							)
							.map((option: { id: number; title: string }) => (
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
									<div className="border border-[var(--white)] px-2.5 py-1 text-xs text-[var(--white)] peer-checked:bg-[var(--white)] peer-checked:text-[var(--black)] peer-checked:hover:text-[var(--black)]/50 peer-checked:hover:bg-[var(--white)]/50 peer-checked:hover:border-[var(--white)]/50 hover:border-[var(--white)]/50 hover:text-[var(--white)]/50 duration-300">
										{option.title}
									</div>
								</label>
							))}
					</div>
				</div>
				<input
					type="text"
					placeholder="Telegram / Email"
					name="contacts"
					required
					className="mt-12 border-b border-[var(--white)] text-[var(--white)] placeholder:text-[var(--white)] placeholder:text-base outline-none focus:border-[var(--white)]/50 pb-1.5 duration-300"
				/>
				<textarea
					name="task"
					placeholder="Опишите задачу..."
					required
					className="border-b border-[var(--white)] h-24 resize-none text-[var(--white)] placeholder:text-[var(--white)] placeholder:text-base mt-12 pb-1.5 outline-none focus:border-[var(--white)]/50 duration-300"
				></textarea>
				<div className="mt-12">
					<div className="text-[var(--white)] text-base mb-4">
						Бюджет
					</div>
					<div className="flex gap-4">
						{budgets
							?.sort(
								(
									a: { id: number; title: string },
									b: { id: number; title: string },
								) => a.id - b.id,
							)
							.map((option: { id: number; title: string }) => (
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
									<div className="border border-[var(--white)] px-2.5 py-1 text-xs text-[var(--white)] peer-checked:bg-[var(--white)] peer-checked:text-[var(--black)] peer-checked:hover:text-[var(--black)]/50 peer-checked:hover:bg-[var(--white)]/50 peer-checked:hover:border-[var(--white)]/50 hover:border-[var(--white)]/50 hover:text-[var(--white)]/50 duration-300">
										{option.title}
									</div>
								</label>
							))}
					</div>
				</div>
				<div className="mt-12">
					<div className="text-[var(--white)] text-base mb-4">
						Срочность
					</div>
					<div className="flex gap-4">
						{deadlines
							?.sort(
								(
									a: { id: number; title: string },
									b: { id: number; title: string },
								) => a.id - b.id,
							)
							.map((option: { id: number; title: string }) => (
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
									<div className="border border-[var(--white)] px-2.5 py-1 text-xs text-[var(--white)] peer-checked:bg-[var(--white)] peer-checked:text-[var(--black)] peer-checked:hover:text-[var(--black)]/50 peer-checked:hover:bg-[var(--white)]/50 peer-checked:hover:border-[var(--white)]/50 hover:border-[var(--white)]/50 hover:text-[var(--white)]/50 duration-300">
										{option.title}
									</div>
								</label>
							))}
					</div>
				</div>
				<button
					type="submit"
					disabled={isSubmitting}
					className="bg-[var(--white)] border border-2 border-[var(--white)] flex items-center justify-center gap-3 p-3 w-1/3 mt-10 cursor-pointer group outline-none focus:bg-transparent hover:bg-transparent disabled:opacity-60 disabled:cursor-wait duration-300"
				>
					<div className="text-[var(--black)] font-semi text-base group-hover:text-[var(--white)] group-focus:text-[var(--white)] duration-300">
						{isSubmitting ? "Отправляем..." : "Отправить заявку"}
					</div>
					<ArrowIcon className="text-[var(--black)] size-6 group-hover:text-[var(--white)] group-focus:text-[var(--white)] group-hover:-rotate-45 duration-300" />
				</button>
			</form>
		</>
	)
}
