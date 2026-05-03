import NumberSection from "../components/NumberSection"
import SectionTitle from "../components/SectionTitle"
import StackCard from "../components/StackCard"

const stackList = [
	{
		id: 1,
		type: "frontend",
		title: "React",
		detail: "Library",
	},
	{
		id: 2,
		type: "Styles",
		title: "Tailwind",
		detail: "Framework",
	},
	{
		id: 3,
		type: "language",
		title: "TypeScript",
		detail: "Framework",
	},
	{
		id: 4,
		type: "frontend",
		title: "HTML/CSS",
		detail: "Framework",
	},
	{
		id: 5,
		type: "Backend",
		title: "Laravel",
		detail: "Framework",
	},
	{
		id: 6,
		type: "backend",
		title: "Express",
		detail: "Framework",
	},
	{
		id: 7,
		type: "database",
		title: "Prisma",
		detail: "Orm",
	},
	{
		id: 8,
		type: "language",
		title: "PHP",
		detail: "Framework",
	},
	{
		id: 9,
		type: "telegram",
		title: "Grammy",
		detail: "Framework",
	},
	{
		id: 10,
		type: "automation",
		title: "Puppeteer",
		detail: "Scraping",
	},
	{
		id: 11,
		type: "logging",
		title: "Pino",
		detail: "Fast logger",
	},
	{
		id: 12,
		type: "containerisation",
		title: "Docker",
		detail: "Framework",
	},
]

export default function MyStack() {
	return (
		<div className="h-screen bg-[var(--black)] px-24 pt-8 flex flex-col">
			<div className="flex justify-between">
				<SectionTitle style="white">My stack</SectionTitle>
				<NumberSection style="white">02</NumberSection>
			</div>
			<div className="grid grid-cols-4 gap-x-20 gap-y-9 mt-20">
				{stackList.map((stack) => (
					<StackCard stack={stack} key={stack.id} />
				))}
			</div>
		</div>
	)
}
