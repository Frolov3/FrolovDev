import prisma from "../db/prisma"
import Urgency from "../types/Urgency"

class UrgencyService {
	async index(): Promise<Urgency[]> {
		const urgencies = await prisma.urgency.findMany()

		return urgencies
	}
}

export default new UrgencyService()
