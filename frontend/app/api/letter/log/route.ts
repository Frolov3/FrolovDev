import { NextResponse } from "next/server"
import { getApiUrl } from "@/app/lib/api"

function getRequestIp(req: Request) {
	const forwardedFor = req.headers.get("x-forwarded-for")
	const forwardedIp = forwardedFor?.split(",")[0]?.trim()

	return (
		forwardedIp ||
		req.headers.get("x-real-ip") ||
		req.headers.get("cf-connecting-ip") ||
		req.headers.get("true-client-ip") ||
		null
	)
}

export async function POST(req: Request) {
	const body = await req.json()
	const userAgent = req.headers.get("user-agent")
	const ip = getRequestIp(req)

	const res = await fetch(`${getApiUrl()}/api/letter/log`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			...body,
			...(userAgent ? { userAgent } : {}),
			...(ip ? { ip } : {}),
		}),
		cache: "no-store",
	})

	const data = await res.json().catch(() => null)

	return NextResponse.json(data, { status: res.status })
}
