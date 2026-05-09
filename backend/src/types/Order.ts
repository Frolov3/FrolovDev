import type Budget from "./Budget"
import type OrderFile from "./OrderFile"
import type ProjectType from "./ProjectType"
import type Urgency from "./Urgency"

type Order = {
	id: number
	projectType: ProjectType
	contact: string
	task: string | null
	budget: Budget
	urgency: Urgency
	files: OrderFile[] | null
	ip: string | null
	userAgent: string | null
	referer: string | null
}

export default Order
