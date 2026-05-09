import prisma from "../db/prisma"
import type Budget from "../types/Budget"

class BudgetService {
	async index(): Promise<Budget[]> {
		const budgets = await prisma.budget.findMany()

		return budgets
	}
}

export default new BudgetService()
