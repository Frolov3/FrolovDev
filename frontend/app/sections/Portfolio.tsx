import NumberSection from "../components/NumberSection"
import SectionTitle from "../components/SectionTitle"
import WorkCard from "../components/WorkCard"

const workList = [
	{
		id: 1,
		title: "TheDraft",
		description: "Сервис мультипостинга для контент-мейкеров",
		detailDescription:
			"Мультипостинг-платформа для контент-мейкеров. Публикуй в несколько соцсетей одним нажатием. Очередь, аналитика, мультиаккаунт.",
		url: "https://github.com/Frolov3/TheDraft",
		stackList: ["React", "Tailwind", "Laravel"],
	},
	{
		id: 2,
		title: "Telegram Shop",
		description: "Магазин внутри telegram",
		detailDescription:
			"Автоматизированный Telegram-бот для монетизации цифровых продуктов, обеспечивающий полный цикл обработки заказов — от пополнения баланса до доставки товара.",
		url: "https://github.com/Frolov3/TelegramShop",
		stackList: ["Grammy", "Prisma", "Pino"],
	},
]

export default function Portfolio() {
	return (
		<div className="h-screen bg-[var(--white)] px-24 pt-8 flex flex-col">
			<div className="flex justify-between">
				<SectionTitle>Portfolio</SectionTitle>
				<NumberSection>03</NumberSection>
			</div>

			<div className="flex-1 flex justify-center items-center gap-8">
				{workList.map((work) => (
					<WorkCard work={work} key={work.id} />
				))}
			</div>
		</div>
	)
}
