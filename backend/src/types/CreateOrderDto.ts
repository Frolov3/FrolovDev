type CreateOrderDto = {
	projectTypeId: number
	contact: string
	task?: string
	budgetId: number
	urgencyId: number
	files?: string[]
	ip?: string
	userAgent?: string
	referer?: string
}

export default CreateOrderDto
