"use client"

import { useState } from "react"
import Stack from "../types/stack"

type StackCardProps = {
	stack: Stack
}

export default function StackCard({ stack }: StackCardProps) {
	const [isFlipped, setIsFlipped] = useState(false)

	return (
		<div
			className="group h-36 cursor-pointer outline-none perspective-[900px]"
			onClick={() => setIsFlipped(!isFlipped)}
			onKeyDown={(event) => {
				if (event.key === "Enter" || event.key === " ") {
					event.preventDefault()
					setIsFlipped(!isFlipped)
				}
			}}
			role="button"
			tabIndex={0}
		>
			<div
				className={`relative size-full transition-transform duration-500 ease-out transform-3d ${
					isFlipped ? "transform-[rotateY(180deg)]" : ""
				}`}
			>
				<div className="absolute inset-0 flex flex-col justify-between border-2 border-[#151515] bg-[var(--black)] px-4 py-2.5 transition-colors duration-300 backface-hidden group-hover:border-[#2c2c2c] group-hover:bg-[#151515] group-focus-visible:border-[#E8E8E8]">
					<div className="text-sm text-[#3d3d3d] font-bold uppercase">
						{stack.type}
					</div>
					<div>
						<div className="text-3xl text-[var(--white)] font-bold">
							{stack.title}
						</div>
						<div className="text-sm text-[#E8E8E8] font-bold">
							{stack.detail}
						</div>
					</div>
				</div>

				<div className="absolute inset-0 border-2 border-[#151515] bg-[var(--black)] px-4 py-3 backface-hidden transform-[rotateY(180deg)] duration-300 group-hover:border-[#2c2c2c] group-hover:bg-[#151515] group-focus-visible:border-[#E8E8E8]">
					<div className="relative flex h-full flex-col justify-between">
						<div className="text-sm font-bold uppercase text-[#3d3d3d]">
							{stack.title}
						</div>
						<div className="text-sm leading-relaxed text-[#E8E8E8] font-semibold">
							{stack.detailDescription}
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}
