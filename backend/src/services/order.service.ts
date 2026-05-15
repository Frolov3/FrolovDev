import prisma from "../db/prisma"
import type CreateOrderDto from "../types/CreateOrderDto"
import type Order from "../types/Order"

class OrderService {
	async create(data: CreateOrderDto): Promise<Order> {
		const files = data.files?.length
			? {
					create: data.files.map((path) => ({
						path,
					})),
				}
			: undefined

		const order = await prisma.order.create({
			data: {
				projectTypeId: data.projectTypeId,
				contact: data.contact,
				task: data.task,
				budgetId: data.budgetId,
				urgencyId: data.urgencyId,
				ip: data.ip,
				userAgent: data.userAgent,
				referer: data.referer,
				files,
			},
			include: {
				projectType: true,
				files: true,
				budget: true,
				urgency: true,
			},
		})

		return order
	}
}

export default new OrderService()
