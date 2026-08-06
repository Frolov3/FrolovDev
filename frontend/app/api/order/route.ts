import { NextResponse } from "next/server"
import { getApiUrl } from "@/app/lib/api"

const requiredFields = [
	{ name: "projectTypeId", message: "Выберите тип проекта" },
	{ name: "contact", message: "Укажите Telegram или Email" },
	{ name: "task", message: "Опишите задачу" },
	{ name: "budgetId", message: "Выберите бюджет" },
	{ name: "urgencyId", message: "Выберите срочность" },
] as const

function getRequiredValue(
	body: FormData | Record<string, unknown>,
	fieldName: (typeof requiredFields)[number]["name"],
) {
	if (body instanceof FormData) {
		const value = body.get(fieldName)

		return typeof value === "string" ? value.trim() : ""
	}

	return String(body[fieldName] || "").trim()
}

export async function POST(req: Request) {
	const contentType = req.headers.get("content-type") || ""
	const isMultipart = contentType.includes("multipart/form-data")
	const body = isMultipart ? await req.formData() : await req.json()
	const errors = requiredFields
		.filter(({ name }) => !getRequiredValue(body, name))
		.map(({ name, message }) => ({ field: name, message }))

	if (errors.length > 0) {
		return NextResponse.json(
			{
				message: "Заполните обязательные поля перед отправкой заявки",
				errors,
			},
			{ status: 400 },
		)
	}

	const res = await fetch(`${getApiUrl()}/api/order`, {
		method: "POST",
		headers: isMultipart
			? undefined
			: { "Content-Type": "application/json" },
		body: isMultipart ? body : JSON.stringify(body),
		cache: "no-store",
	})

	const data = await res.json().catch(() => null)

	return NextResponse.json(data, { status: res.status })
}
