import { NextResponse } from "next/server"

export async function POST(req: Request) {
	const contentType = req.headers.get("content-type") || ""
	const isMultipart = contentType.includes("multipart/form-data")
	const body = isMultipart ? await req.formData() : await req.json()

	const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/order`, {
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
