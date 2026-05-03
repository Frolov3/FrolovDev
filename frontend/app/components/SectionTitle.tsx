import { ReactNode } from "react"

type SectionTitleProps = {
	children: ReactNode
	style?: "white" | "black"
}

export default function SectionTitle({
	children,
	style = "black",
}: SectionTitleProps) {
	return (
		<h2
			className={`text-4 uppercase ${style === "black" ? "text-[var(--black)]" : "text-[var(--white)]"}`}
		>
			{children}
		</h2>
	)
}
