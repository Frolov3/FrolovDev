import Stack from "../types/stack"

type StackCardProps = {
	stack: Stack
}

export default function StackCard({ stack }: StackCardProps) {
	return (
		<div className="flex flex-col justify-between border-2 border-[#151515] h-36 py-2.5 px-4">
			<div className="text-3 text-[#3d3d3d] font-bold uppercase">
				{stack.type}
			</div>
			<div>
				<div className="text-3xl text-[var(--white)] font-bold">
					{stack.title}
				</div>
				<div className="text-3 text-[#E8E8E8] font-bold">
					{stack.detail}
				</div>
			</div>
		</div>
	)
}
