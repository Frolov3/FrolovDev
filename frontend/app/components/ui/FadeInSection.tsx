"use client"
import { type ReactNode, useEffect, useRef, useState } from "react"

type FadeInSectionProps = {
	children: ReactNode
	className?: string
}

function FadeInSection({
	children,
	className = "",
}: FadeInSectionProps) {
	const ref = useRef<HTMLDivElement | null>(null)
	const [isVisible, setIsVisible] = useState(false)

	useEffect(() => {
		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting) {
					setIsVisible(true)
					observer.disconnect()
				}
			},
			{ threshold: 0.2 },
		)

		if (ref.current) observer.observe(ref.current)

		return () => observer.disconnect()
	}, [])

	const visibleClass = isVisible
		? "opacity-100 translate-y-0"
		: `opacity-0 translate-y-10`

	return (
		<div
			ref={ref}
			className={[
				className,
				"transition-[opacity,transform] duration-1000 ease-out will-change-[opacity,transform] motion-reduce:transform-none motion-reduce:transition-opacity",
				visibleClass,
			]
				.filter(Boolean)
				.join(" ")}
		>
			{children}
		</div>
	)
}

export default FadeInSection
