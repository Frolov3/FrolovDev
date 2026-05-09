import { Request, Response } from "express"
import orderService from "../services/order.service"
import type CreateOrderDto from "../types/CreateOrderDto"

type OrderRequestBody = Omit<
	CreateOrderDto,
	"projectTypeId" | "budgetId" | "urgencyId" | "files"
> & {
	projectTypeId: number | string
	budgetId: number | string
	urgencyId: number | string
	files?: string | string[]
}

class OrderController {
	async create(req: Request<{}, {}, OrderRequestBody>, res: Response) {
		try {
			const files = req.files
			const uploadedFiles = Array.isArray(files)
				? files.map((file) => `/uploads/${file.filename}`)
				: []
			const bodyFiles =
				typeof req.body.files === "string"
					? [req.body.files]
					: Array.isArray(req.body.files)
						? req.body.files
						: []

			const toNumber = (value?: string | number) =>
				typeof value === "number" ? value : Number(value)

			const data = {
				...req.body,
				projectTypeId: toNumber(req.body.projectTypeId),
				budgetId: toNumber(req.body.budgetId),
				urgencyId: toNumber(req.body.urgencyId),
				files: uploadedFiles.length > 0 ? uploadedFiles : bodyFiles,
				ip: req.ip || req.socket.remoteAddress || undefined,
				referer: req.get("referer") || req.get("referrer"),
				userAgent: req.get("user-agent"),
			}

			const order = await orderService.create(data)

			return res.json({ success: true })
		} catch (error) {
			return res
				.status(500)
				.json({ message: "Error create order", success: false })
		}
	}
}

export default new OrderController()
