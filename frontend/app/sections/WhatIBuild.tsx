import NumberSection from "../components/NumberSection"
import SectionTitle from "../components/SectionTitle"
import SkillCard from "../components/SkillCard"

const skills = [
	{
		id: 1,
		img: "site.svg",
		title: "Web-сервисы",
		description:
			"Полноценные веб-приложения от UI до БД. SPA, REST API, авторизация.",
	},
	{
		id: 2,
		img: "message.svg",
		title: "Telegram-боты",
		description:
			"Боты любой сложности. Магазины, CRM, автоматические рассылки.",
	},
	{
		id: 3,
		img: "robot.svg",
		title: "Автоматизация",
		description:
			"Парсинг, скрейпинг, автопостинг. Убираю ручной труд из бизнес-процессов.",
	},
]

export default function WhatIBuild() {
	return (
		<div className="h-screen bg-[var(--white)] px-24 flex flex-col">
			<div className="flex justify-between mt-8">
				<SectionTitle>What i build</SectionTitle>
				<NumberSection>01</NumberSection>
			</div>
			<div className="flex-1 flex justify-center items-center gap-48">
				{skills.map((skill) => (
					<SkillCard skill={skill} key={skill.id} />
				))}
			</div>
		</div>
	)
}
