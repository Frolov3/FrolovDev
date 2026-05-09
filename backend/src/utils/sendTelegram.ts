import path from "path"
import fs from "fs/promises"
import { fileURLToPath } from "url"
import Order from "../types/Order"

const uploadsDir = fileURLToPath(new URL("../../", import.meta.url))

function chunkFiles<T>(items: T[], size: number) {
	const chunks: T[][] = []

	for (let i = 0; i < items.length; i += size) {
		chunks.push(items.slice(i, i + size))
	}

	return chunks
}

async function telegramRequest(
	url: string,
	init: RequestInit,
	errorMessage: string,
) {
	const response = await fetch(url, init)
	const data = await response.json()

	if (!response.ok || !data.ok) {
		throw new Error(
			`${errorMessage}: ${data.description || response.status}`,
		)
	}

	return data
}

function escapeHtml(text: string) {
	return text
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
}

async function sendTelegram(order: Order) {
	const chatId = process.env.TELEGRAM_CHAT_ID
	const botToken = process.env.TELEGRAM_BOT_TOKEN

	if (chatId && botToken) {
		const botUrl = `https://api.telegram.org/bot${botToken}`
		let textMessage = `
<tg-emoji emoji-id="5893382531037794941">🔎</tg-emoji><b>Тип проекта:</b> ${order.projectType.title}
<tg-emoji emoji-id="5902056028513505203">💳</tg-emoji><b>Бюджет:</b> ${order.budget.title}
<tg-emoji emoji-id="5893102202817352158">🕞</tg-emoji><b>Срочность:</b> ${order.urgency.title}
<tg-emoji emoji-id="5902335789798265487">👤</tg-emoji><b>Контакт:</b> ${order.contact}
`

		if (order.task) {
			textMessage += `<tg-emoji emoji-id="5893290369629556374">💡</tg-emoji><b>Задача:</b> ${escapeHtml(order.task)}`
		}

		await telegramRequest(
			`${botUrl}/sendMessage`,
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					chat_id: chatId,
					text: `<tg-emoji emoji-id="5895514131896733546">✅</tg-emoji> <b>Заказ ${order.id}</b>`,
					parse_mode: "HTML",
				}),
			},
			"Failed to send Telegram order header",
		)

		if (!order.files?.length) {
			await telegramRequest(
				`${botUrl}/sendMessage`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						chat_id: chatId,
						text: textMessage.slice(0, 4096),
						parse_mode: "HTML",
					}),
				},
				"Failed to send Telegram order details",
			)
		} else {
			const fileGroups = chunkFiles(order.files, 10)

			for (const [groupIndex, group] of fileGroups.entries()) {
				if (group.length === 1) {
					const [file] = group
					const buffer = await fs.readFile(uploadsDir + file.path)
					const form = new FormData()

					form.append("chat_id", chatId)
					form.append("caption", textMessage.slice(0, 1024))
					form.append("parse_mode", "HTML")
					form.append(
						"document",
						new Blob([buffer]),
						path.basename(file.path),
					)

					await telegramRequest(
						`${botUrl}/sendDocument`,
						{
							method: "POST",
							body: form,
						},
						"Failed to send Telegram document",
					)

					continue
				}

				const form = new FormData()
				const media: Array<{
					type: "document"
					media: string
					caption?: string
					parse_mode?: "HTML"
				}> = []

				form.append("chat_id", chatId)

				for (const [fileIndex, file] of group.entries()) {
					const key = `file${groupIndex}-${fileIndex}`
					const buffer = await fs.readFile(uploadsDir + file.path)

					media.push({
						type: "document",
						media: `attach://${key}`,
						...(fileIndex === order.files?.length - 1
							? {
									caption: textMessage.slice(0, 1024),
									parse_mode: "HTML" as const,
								}
							: {}),
					})

					form.append(
						key,
						new Blob([buffer]),
						path.basename(file.path),
					)
				}

				form.append("media", JSON.stringify(media))

				await telegramRequest(
					`${botUrl}/sendMediaGroup`,
					{
						method: "POST",
						body: form,
					},
					"Failed to send Telegram media group",
				)
			}
		}
	}
}

export default sendTelegram
