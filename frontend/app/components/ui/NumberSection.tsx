import { ReactNode } from "react"

type NumberSectionProps = {
	children: ReactNode
	style?: "white" | "black"
}

export default function NumberSection({
	children,
	style = "black",
}: NumberSectionProps) {
	return (
		<div
			className={`text-8xl tracking-[-7%] font-extrabold ${style === "black" ? "text-[var(--black)]" : "text-[#161616]"}`}
		>
			{children}
		</div>
	)
}
