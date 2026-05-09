import type { Response, Request } from "express"
import urgencyService from "../services/urgency.service"
import logger from "../utils/logger"

class UrgencyController {
	async index(req: Request, res: Response) {
		try {
			const urgencies = await urgencyService.index()

			logger.info({ urgencies: urgencies })

			return res.json({ urgencies: urgencies, success: true })
		} catch (error) {
			const err =
				error instanceof Error ? error : new Error(String(error))

			logger.error({
				err: {
					message: err.message,
					stack: err.stack,
				},
			})

			return res.status(500).json({
				message: "Urgencies issuance error",
				success: false,
			})
		}
	}
}

export default new UrgencyController()
