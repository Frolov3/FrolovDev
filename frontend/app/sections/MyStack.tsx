import FadeInSection from "../components/ui/FadeInSection"
import NumberSection from "../components/ui/NumberSection"
import SectionTitle from "../components/ui/SectionTitle"
import StackCard from "../components/ui/StackCard"

const stackList = [
	{
		id: 1,
		type: "frontend",
		title: "React",
		detail: "Library",
		detailDescription: "Компоненты, хуки и понятная структура.",
	},
	{
		id: 2,
		type: "styles",
		title: "Tailwind",
		detail: "Framework",
		detailDescription: "Быстрая стилизация интерфейсов без лишнего CSS.",
	},
	{
		id: 3,
		type: "language",
		title: "TypeScript",
		detail: "Language",
		detailDescription: "Типы, дженерики — ожидаемое поведение программы.",
	},
	{
		id: 4,
		type: "frontend",
		title: "HTML/CSS",
		detail: "Markup & styles",
		detailDescription:
			"Семантика, адаптивность и аккуратная визуальная основа.",
	},
	{
		id: 5,
		type: "backend",
		title: "Laravel",
		detail: "Framework",
		detailDescription:
			"API, бизнес-логика и удобная серверная архитектура.",
	},
	{
		id: 6,
		type: "backend",
		title: "Express",
		detail: "Framework",
		detailDescription: "Лёгкие API, роутинг и интеграции на Node.js.",
	},
	{
		id: 7,
		type: "database",
		title: "Prisma",
		detail: "ORM",
		detailDescription: "Типизированные модели, миграции и запросы к базе.",
	},
	{
		id: 8,
		type: "backend",
		title: "PHP",
		detail: "Language",
		detailDescription: "Backend-логика, обработка данных и интеграции.",
	},
	{
		id: 9,
		type: "telegram",
		title: "GrammY",
		detail: "Framework",
		detailDescription: "Команды, меню и сценарии для Telegram-ботов.",
	},
	{
		id: 10,
		type: "automation",
		title: "Puppeteer",
		detail: "Scraping",
		detailDescription: "Браузерная автоматизация, парсинг и не только.",
	},
	{
		id: 11,
		type: "logging",
		title: "Pino",
		detail: "Fast logger",
		detailDescription:
			"Структурированные логи с контекстом - быстро и без потери контекста.",
	},
	{
		id: 12,
		type: "containerization",
		title: "Docker",
		detail: "Tool",
		detailDescription:
			"Изолированное окружение, предсказуемый запуск — контейнеризация.",
	},
]

export default function MyStack() {
	return (
		<div className="min-h-screen bg-[var(--black)] px-6 sm:px-10 lg:px-24 pt-8 pb-8 flex flex-col selection:bg-[var(--white)]/40">
			<div className="flex justify-between">
				<SectionTitle style="white">My stack</SectionTitle>
				<NumberSection style="white">02</NumberSection>
			</div>
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-20 gap-y-9 mt-16 lg:mt-20 2xl:mt-48">
				{stackList.map((stack) => (
					<FadeInSection key={stack.id}>
						<StackCard stack={stack} key={stack.id} />
					</FadeInSection>
				))}
			</div>
		</div>
	)
}
