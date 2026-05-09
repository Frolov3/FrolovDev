import prisma from "../db/prisma"
import ProjectType from "../types/ProjectType"

class ProjectTypeService {
	async index(): Promise<ProjectType[]> {
		const projectTypes = await prisma.projectType.findMany()

		return projectTypes
	}
}

export default new ProjectTypeService()
