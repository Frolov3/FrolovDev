const DEFAULT_API_URL = "http://backend:3000"

export function getApiUrl() {
	const apiUrl =
		process.env.API_URL ||
		process.env.NEXT_PUBLIC_API_URL ||
		DEFAULT_API_URL

	return apiUrl.replace(/\/$/, "")
}
