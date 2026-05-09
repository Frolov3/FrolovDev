import type { Response, Request } from "express"
import BudgetService from "../services/budget.service"

class BudgetController {
	async index(req: Request, res: Response) {
		try {
			const budgets = await BudgetService.index()

			return res.json({ budgets: budgets, success: true })
		} catch (error) {
			return res
				.status(500)
				.json({ message: "Budget issuance error", success: false })
		}
	}
}

export default new BudgetController()
