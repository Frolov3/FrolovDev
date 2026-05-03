import Image from "next/image"
import type Skill from "../types/skill"

type SkillCardProps = {
	skill: Skill
}

export default function SkillCard({ skill }: SkillCardProps) {
	return (
		<div className="w-64">
			<div className="w-32 h-32 flex items-center justify-center">
				<Image
					src={skill.img}
					alt={skill.title}
					width={128}
					height={128}
				/>
			</div>
			<div className="mt-5 w-3/12 h-0.5 bg-[var(--black)]"></div>
			<div className="mt-2 font-semibold text-5 text-[var(--black)]">
				{skill.title}
			</div>
			<p className="mt-1.5 text-4 text-[var(--black)] text-justify">
				{skill.description}
			</p>
		</div>
	)
}
