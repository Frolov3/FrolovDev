import prisma from "../db/prisma"
import Later from "../types/Letter"

class LetterService {
	async get({ title }: { title: string }): Promise<Later | null> {
		const letter = await prisma.letter.findUnique({
			where: { title: title },
			include: {
				messages: true,
				music: true,
				buttons: true,
			},
		})

		return letter
	}
}

export default new LetterService()
