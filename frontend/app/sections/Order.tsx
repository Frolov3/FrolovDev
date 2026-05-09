import NumberSection from "../components/NumberSection"
import SectionTitle from "../components/SectionTitle"
import OrderForm from "./OrderForm"

type Option = {
	id: number
	title: string
}

async function fetchJSON<T>(path: string): Promise<T> {
	const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${path}`, {
		cache: "no-store",
	})

	if (!res.ok) {
		throw new Error(`Failed to load ${path}`)
	}

	return res.json()
}

export default async function Order() {
	const [budgets, projectTypes, deadlines] = await Promise.all([
		fetchJSON<{ budgets: Option[] }>("/api/budget"),
		fetchJSON<{ projectTypes: Option[] }>("/api/project-type"),
		fetchJSON<{ urgencies: Option[] }>("/api/urgency"),
	])

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
