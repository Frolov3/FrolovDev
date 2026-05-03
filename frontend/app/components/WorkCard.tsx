import Work from "../types/work"

type WorkCardProps = {
	work: Work
}

export default function WorkCard({ work }: WorkCardProps) {
	return (
		<a href={work.url} target="_blank" className="w-1/2">
			<div className="border-3 border-[var(--black)] h-64 flex flex-col group">
				<div className="bg-[var(--black)] group-hover:bg-transparent px-5.5 pt-7 pb-5 duration-500">
					<div className="text-[var(--white)] group-hover:text-[var(--black)] font-bold text-2xl duration-500">
						{work.title}
					</div>
					<div className="text-[var(--white)] group-hover:text-[var(--black)] text-sm mt-2 duration-500">
						{work.description}
					</div>
				</div>
				<div className="p-3 flex flex-col h-full group-hover:bg-[var(--black)] duration-500">
					<div className="text-[#3D3D3D] group-hover:text-[var(--white)] duration-500">
						{work.detailDescription}
					</div>

					<div className="flex gap-3 mt-auto">
						{work.stackList.map((stackItem, index) => (
							<div
								className="border-2 border-[var(--black)] group-hover:border-[var(--white)] text-[var(--black)] group-hover:text-[var(--white)] px-2.5 py-0.5 duration-500"
								key={index}
							>
								{stackItem}
							</div>
						))}
					</div>
				</div>
			</div>
		</a>
	)
}
