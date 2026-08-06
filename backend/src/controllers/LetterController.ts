import type { Response, Request } from "express"
import LetterService from "../services/letter.service"
import logger from "../utils/logger"
import { escapeHtml, sendTelegramLog } from "../utils/sendTelegram"

type LetterLogBody = {
	action?: unknown
	url?: unknown
	title?: unknown
	page?: unknown
	totalPages?: unknown
	content?: unknown
	buttonText?: unknown
	userAgent?: unknown
	ip?: unknown
}

function asOptionalString(value: unknown) {
	if (typeof value !== "string") return null

	const trimmed = value.trim()
	return trimmed || null
}

function asOptionalPositiveInteger(value: unknown) {
	if (typeof value !== "number" || !Number.isInteger(value) || value < 1) {
		return null
	}

	return value
}

function getRequestIp(req: Request) {
	const forwardedFor = req.get("x-forwarded-for")
	const forwardedIp = forwardedFor?.split(",")[0]?.trim()

	return (
		asOptionalString(req.body?.ip) ||
		forwardedIp ||
		req.get("x-real-ip") ||
		req.ip ||
		null
	)
}

class LetterController {
	async get(req: Request, res: Response) {
		try {
			const { title } = req.query as { title: string }

			const letter = await LetterService.get({ title })

			logger.info({ letter: letter })

			return res.json({ letter: letter, success: true })
		} catch (error) {
			const err =
				error instanceof Error ? error : new Error(String(error))

			logger.error({
				err: {
					message: err.message,
					stack: err.stack,
				},
			})

			return res
				.status(500)
				.json({ message: "Letter issuance error", success: false })
		}
	}

	async log(req: Request, res: Response) {
		try {
			const {
				action,
				url,
				title,
				page,
				totalPages,
				content,
				buttonText,
				userAgent,
			} = req.body as LetterLogBody

			const logAction = asOptionalString(action)
			const logUrl = asOptionalString(url)

			if (!logAction || !logUrl) {
				return res.status(400).json({
					message: "Action and url are required",
					success: false,
				})
			}

			const logTitle = asOptionalString(title)
			const logPage = asOptionalPositiveInteger(page)
			const logTotalPages = asOptionalPositiveInteger(totalPages)
			const logContent = asOptionalString(content)
			const logButtonText = asOptionalString(buttonText)
			const logUserAgent =
				asOptionalString(userAgent) || req.get("user-agent") || null
			const logIp = getRequestIp(req)
			const pageText =
				logPage && logTotalPages
					? `\n<b>Страница:</b> ${logPage}/${logTotalPages}`
					: ""
			const userText = logUserAgent
				? `\n<b>User-Agent:</b> ${escapeHtml(logUserAgent)}`
				: ""
			const ipText = logIp ? `\n<b>IP:</b> ${escapeHtml(logIp)}` : ""
			const clickedButtonText = logButtonText
				? `\n<b>Кнопка:</b> ${escapeHtml(logButtonText)}`
				: ""
			const contentText = logContent
				? `\n<b>Текст страницы:</b>\n${escapeHtml(logContent).slice(0, 2500)}`
				: ""

			await sendTelegramLog(
				`<b>Лог письма</b>\n<b>Действие:</b> ${escapeHtml(logAction)}\n<b>URL:</b> ${escapeHtml(logUrl)}${
					logTitle ? `\n<b>Письмо:</b> ${escapeHtml(logTitle)}` : ""
				}${pageText}${clickedButtonText}${userText}${ipText}${contentText}`,
			)

			return res.json({ success: true })
		} catch (error) {
			const err =
				error instanceof Error ? error : new Error(String(error))

			logger.error({
				err: {
					message: err.message,
					stack: err.stack,
				},
			})

			return res
				.status(500)
				.json({ message: "Letter log error", success: false })
		}
	}
}

export default new LetterController()
