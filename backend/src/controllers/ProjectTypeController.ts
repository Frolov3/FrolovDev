import type { Response, Request } from "express"
import projectTypeService from "../services/project-type.service"
import logger from "../utils/logger"

class ProjectTypeController {
	async index(req: Request, res: Response) {
		try {
			const projectTypes = await projectTypeService.index()

			logger.info({ projectTypes: projectTypes })

			return res.json({ projectTypes: projectTypes, success: true })
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
				message: "Project types issuance error",
				success: false,
			})
		}
	}
}

export default new ProjectTypeController()
