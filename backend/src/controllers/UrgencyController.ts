import type { Response, Request } from "express"
import urgencyService from "../services/urgency.service"

class UrgencyController {
	async index(req: Request, res: Response) {
		try {
			const urgencies = await urgencyService.index()

			return res.json({ urgencies: urgencies, success: true })
		} catch (error) {
			return res.status(500).json({
				message: "Urgencies issuance error",
				success: false,
			})
		}
	}
}

export default new UrgencyController()
