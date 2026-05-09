import type { Response, Request } from "express"
import projectTypeService from "../services/project-type.service"

class ProjectTypeController {
	async index(req: Request, res: Response) {
		try {
			const projectTypes = await projectTypeService.index()

			return res.json({ projectTypes: projectTypes, success: true })
		} catch (error) {
			return res
				.status(500)
				.json({
					message: "Project types issuance error",
					success: false,
				})
		}
	}
}

export default new ProjectTypeController()
