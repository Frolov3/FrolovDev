import FadeInSection from "../components/ui/FadeInSection"
import NumberSection from "../components/ui/NumberSection"
import SectionTitle from "../components/ui/SectionTitle"
import WorkCard from "../components/ui/WorkCard"

const workList = [
	{
		id: 1,
		title: "TheDraft",
		description: "Сервис мультипостинга для контент-мейкеров",
		detailDescription:
			"Веб-сервис для автоматизации публикаций в социальных сетях. Создавайте, планируйте и размещайте контент сразу на нескольких платформах из единого интерфейса.",
		url: "https://github.com/Frolov3/TheDraft",
		stackList: ["React", "Tailwind", "Laravel", "Express", "Pino"],
	},
	{
		id: 2,
		title: "Telegram Shop",
		description: "Магазин внутри Telegram",
		detailDescription:
			"Автоматизированный Telegram-бот для монетизации цифровых продуктов, обеспечивающий полный цикл обработки заказов - от пополнения баланса до доставки товара.",
		url: "https://github.com/Frolov3/TelegramShop",
		stackList: ["Grammy", "Prisma", "Pino"],
	},
]

export default function Portfolio() {
	return (
		<div className="min-h-screen bg-[var(--white)] px-6 sm:px-10 lg:px-24 py-8 flex flex-col selection:bg-[var(--black)]/40">
			<div className="flex justify-between">
				<SectionTitle>Portfolio</SectionTitle>
				<NumberSection>03</NumberSection>
			</div>

			<div className="flex-1 grid grid-cols-1 lg:grid-cols-2 content-center justify-items-stretch gap-8 py-12">
				{workList.map((work) => (
					<FadeInSection key={work.id} className="h-full">
						<WorkCard work={work} />
					</FadeInSection>
				))}
			</div>
		</div>
	)
}
