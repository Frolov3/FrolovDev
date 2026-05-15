import FadeInSection from "../components/ui/FadeInSection"
import NumberSection from "../components/ui/NumberSection"
import SectionTitle from "../components/ui/SectionTitle"
import SkillCard from "../components/ui/SkillCard"

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
		<div className="min-h-screen bg-[var(--white)] px-6 py-8 sm:px-10 lg:px-24 flex flex-col">
			<div className="flex justify-between">
				<SectionTitle>What i build</SectionTitle>
				<NumberSection>01</NumberSection>
			</div>
			<div className="flex-1 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-12 md:gap-10 lg:gap-24 xl:gap-48 items-center justify-items-center py-16 md:py-0">
				{skills.map((skill) => (
					<FadeInSection key={skill.id}>
						<SkillCard skill={skill} key={skill.id} />
					</FadeInSection>
				))}
			</div>
		</div>
	)
}
