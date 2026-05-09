import ArrowIcon from "../components/icons/ArrowIcon"
import NumberSection from "../components/NumberSection"
import SectionTitle from "../components/SectionTitle"

async function fetchBudget() {
	const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/budget`)

	return res.json()
}

async function fetchProjectTypes() {
	const res = await fetch(
		`${process.env.NEXT_PUBLIC_API_URL}/api/project-type`,
	)

	return res.json()
}

async function fetchDeadlines() {
	const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/urgency`)

	return res.json()
}

export default async function Order() {
	const budgets = await fetchBudget()
	const projectTypes = await fetchProjectTypes()
	const deadlines = await fetchDeadlines()

	return (
		<div className="h-screen bg-[var(--black)] px-24 pt-8 flex flex-col">
			<div className="flex justify-between">
				<SectionTitle style="white">Order</SectionTitle>
				<NumberSection style="white">04</NumberSection>
			</div>
			<div className="text-2xl font-semibold text-[var(--white)]">
				Оформить заказ
			</div>
			<form action="" className="flex flex-col w-1/2 mt-12">
				<div>
					<div className="text-[var(--white)] text-base mb-4">
						Тип проекта
					</div>
					<div className="flex gap-4">
						{projectTypes.projectTypes
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
						{budgets.budgets
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
						{deadlines.urgencies
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
				<button className="bg-[var(--white)] border border-2 border-[var(--white)] flex items-center gap-3 p-3 w-1/3 mt-10 cursor-pointer group outline-none focus:bg-transparent hover:bg-transparent duration-300">
					<div className="text-[var(--black)] font-semi text-base group-hover:text-[var(--white)] group-focus:text-[var(--white)] duration-300">
						Отправить заявку
					</div>
					<ArrowIcon className="text-[var(--black)] size-6 group-hover:text-[var(--white)]  group-focus:text-[var(--white)] group-hover:-rotate-45 duration-300" />
				</button>
			</form>
		</div>
	)
}
