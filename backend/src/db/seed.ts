import prisma from "./prisma"

async function budgetSeed() {
	await prisma.budget.createMany({
		data: [
			{ title: "До 3000" },
			{ title: "3000 - 10000" },
			{ title: "10000 - 30000" },
			{ title: "30000 +" },
		],
	})
}

async function urgencySeed() {
	await prisma.urgency.createMany({
		data: [
			{ title: "1 - 3 дня" },
			{ title: "1 - 2 недели" },
			{ title: "Не важно" },
		],
	})
}

async function projectTypeSeed() {
	await prisma.projectType.createMany({
		data: [
			{ title: "Веб - сервис" },
			{ title: "Telegram Bot" },
			{ title: "Автоматизация" },
			{ title: "Парсер" },
			{ title: "Лендинг" },
			{ title: "Другое" },
		],
	})
}

async function seedData() {
	const budget = await prisma.budget.count()
	const urgency = await prisma.urgency.count()
	const projectType = await prisma.projectType.count()

	if (budget === 0) await budgetSeed()
	if (urgency === 0) await urgencySeed()
	if (projectType === 0) await projectTypeSeed()
}

export default seedData
