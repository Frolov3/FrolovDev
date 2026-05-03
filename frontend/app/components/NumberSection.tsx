import { PropsWithChildren } from "react"

export default function NumberSection({ children }: PropsWithChildren) {
	return (
		<div className="text-8xl tracking-[-7%] font-extrabold text-[var(--black)]">
			{children}
		</div>
	)
}
