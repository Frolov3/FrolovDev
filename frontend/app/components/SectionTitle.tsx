import { PropsWithChildren } from "react"

export default function SectionTitle({ children }: PropsWithChildren) {
	return <h2 className="text-4 text-[var(--black)] uppercase">{children}</h2>
}
