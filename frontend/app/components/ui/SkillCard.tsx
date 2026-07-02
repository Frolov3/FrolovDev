import Image from "next/image"
import type Skill from "../../types/skill"

type SkillCardProps = {
	skill: Skill
}

export default function SkillCard({ skill }: SkillCardProps) {
	return (
		<div className="w-full max-w-96">
			<div className="relative w-24 h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 flex items-center justify-center">
				<Image
					src={skill.img}
					alt={skill.title}
					fill
					className="object-contain"
				/>
			</div>
			<div className="mt-5 w-3/12 h-0.5 bg-[var(--black)]"></div>
			<div className="mt-2 font-semibold text-base text-[var(--black)] text-base 2xl:text-2xl ">
				{skill.title}
			</div>
			<p className="mt-1.5 text-sm md:text-base 2xl:text-xl text-[var(--black)] text-left md:text-justify">
				{skill.description}
			</p>
		</div>
	)
}
