import Work from "../types/work"

type WorkCardProps = {
	work: Work
}

export default function WorkCard({ work }: WorkCardProps) {
	return (
		<a
			href={work.url}
			target="_blank"
			className="flex w-full"
		>
			<div className="w-full min-h-64 border-3 border-[var(--black)] flex flex-col group">
				<div className="bg-[var(--black)] group-hover:bg-transparent px-4 sm:px-5.5 pt-6 sm:pt-7 pb-5 duration-500">
					<div className="text-[var(--white)] group-hover:text-[var(--black)] font-bold text-xl sm:text-2xl duration-500">
						{work.title}
					</div>
					<div className="text-[var(--white)] group-hover:text-[var(--black)] text-sm mt-2 duration-500">
						{work.description}
					</div>
				</div>
				<div className="p-3 flex flex-col flex-1 group-hover:bg-[var(--black)] duration-500">
					<div className="text-sm sm:text-base text-[#3D3D3D] group-hover:text-[var(--white)] duration-500">
						{work.detailDescription}
					</div>

					<div className="flex flex-wrap gap-2 sm:gap-3 mt-auto pt-6">
						{work.stackList.map((stackItem, index) => (
							<div
								className="border-2 border-[var(--black)] group-hover:border-[var(--white)] text-[var(--black)] group-hover:text-[var(--white)] px-2.5 py-0.5 text-sm sm:text-base duration-500"
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
