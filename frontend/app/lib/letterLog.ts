type LetterLogPayload = {
	action: string
	url: string
	title?: string
	page?: number
	totalPages?: number
	content?: string
}

export function sendLetterLog(payload: LetterLogPayload) {
	fetch("/api/letter/log", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(payload),
		keepalive: true,
	}).catch(() => {})
}
