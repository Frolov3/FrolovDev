import type { Response, Request } from "express"
import BudgetService from "../services/budget.service"
import logger from "../utils/logger"

class BudgetController {
	async index(req: Request, res: Response) {
		try {
			const budgets = await BudgetService.index()

			logger.info({ budgets: budgets })

			return res.json({ budgets: budgets, success: true })
		} catch (error) {
			const err =
				error instanceof Error ? error : new Error(String(error))

			logger.error({
				err: {
					message: err.message,
					stack: err.stack,
				},
			})

			return res
				.status(500)
				.json({ message: "Budget issuance error", success: false })
		}
	}
}

export default new BudgetController()
