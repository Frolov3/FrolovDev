import "./globals.css"
import Hero from "./sections/Hero"
import GitHubIcon from "./components/icons/GitHubIcon"
import type socialNetwork from "./types/socialNetwork"
import TelegramIcon from "./components/icons/TelegramIcon"
import LolzIcon from "./components/icons/LolzIcon"
import WhatIBuild from "./sections/WhatIBuild"
import MyStack from "./sections/MyStack"
import Portfolio from "./sections/Portfolio"
import Order from "./sections/Order"

const socialNetworks: socialNetwork[] = [
	{
		id: 1,
		title: "Telegram",
		link: "https://t.me/Anybes3",
		icon: <TelegramIcon className="size-4" />,
	},
	{
		id: 2,
		title: "GitHub",
		link: "https://github.com/Frolov3",
		icon: <GitHubIcon className="size-4" />,
	},
	{
		id: 3,
		title: "Lolz",
		link: "https://lolz.live/members/1018972/",
		icon: <LolzIcon className="size-4" />,
	},
]

export default function Home() {
	return (
		<html>
			<body>
				<main>
					<Hero socialNetworks={socialNetworks} />
					<WhatIBuild />
					<MyStack />
					<Portfolio />
					<Order />
				</main>
			</body>
		</html>
	)
}
