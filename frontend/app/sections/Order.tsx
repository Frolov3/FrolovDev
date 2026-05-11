import NumberSection from "../components/NumberSection"
import SectionTitle from "../components/SectionTitle"
import OrderForm from "./OrderForm"

type Option = {
	id: number
	title: string
}

type OrderOptions = [
	{ budgets: Option[] },
	{ projectTypes: Option[] },
	{ urgencies: Option[] },
]

const fallbackBudgets: Option[] = [
	{ id: 1, title: "До 3000" },
	{ id: 2, title: "3000 - 10000" },
	{ id: 3, title: "10000 - 30000" },
	{ id: 4, title: "30000 +" },
]

const fallbackProjectTypes: Option[] = [
	{ id: 1, title: "Веб - сервис" },
	{ id: 2, title: "Telegram Bot" },
	{ id: 3, title: "Автоматизация" },
	{ id: 4, title: "Парсер" },
	{ id: 5, title: "Лендинг" },
	{ id: 6, title: "Другое" },
]

const fallbackDeadlines: Option[] = [
	{ id: 1, title: "1 - 3 дня" },
	{ id: 2, title: "1 - 2 недели" },
	{ id: 3, title: "Не важно" },
]

async function fetchJSON<T>(path: string): Promise<T> {
	const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${path}`, {
		cache: "no-store",
	})

	if (!res.ok) {
		throw new Error(`Failed to load ${path}: ${res.status}`)
	}

	return res.json()
}

async function fetchOrderOptions(): Promise<OrderOptions> {
	try {
		return await Promise.all([
			fetchJSON<{ budgets: Option[] }>("/api/budget"),
			fetchJSON<{ projectTypes: Option[] }>("/api/project-type"),
			fetchJSON<{ urgencies: Option[] }>("/api/urgency"),
		])
	} catch {
		console.warn("Failed to load order options. Using fallback values.")

		return [
			{ budgets: fallbackBudgets },
			{ projectTypes: fallbackProjectTypes },
			{ urgencies: fallbackDeadlines },
		]
	}
}

export default async function Order() {
	const [budgets, projectTypes, deadlines] = await fetchOrderOptions()

	return (
		<div className="h-screen bg-[var(--black)] px-24 pt-8 flex flex-col">
			<div className="flex justify-between">
				<SectionTitle style="white">Order</SectionTitle>
				<NumberSection style="white">04</NumberSection>
			</div>
			<div className="text-2xl font-semibold text-[var(--white)]">
				Оформить заказ
			</div>

			<OrderForm
				budgets={budgets.budgets}
				projectTypes={projectTypes.projectTypes}
				deadlines={deadlines.urgencies}
			/>
		</div>
	)
}
