import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
	title: "Frolov Dev",
	description: "Full stack разработка под ключ: от веб-приложений и REST API до Telegram-ботов и автоматизации.",
}

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html lang="ru">
			<body>
				<div>{children}</div>
			</body>
		</html>
	)
}
