import { SVGProps } from "react"

export function ChevronLeftIcon(props: SVGProps<SVGSVGElement>) {
	return (
		<svg
			viewBox="0 0 24 24"
			width={18}
			height={18}
			fill="none"
			stroke="currentColor"
			strokeWidth={2}
			strokeLinecap="round"
			strokeLinejoin="round"
			aria-hidden="true"
			{...props}
		>
			<polyline points="15 18 9 12 15 6" />
		</svg>
	)
}

export function ChevronRightIcon(props: SVGProps<SVGSVGElement>) {
	return (
		<svg
			viewBox="0 0 24 24"
			width={18}
			height={18}
			fill="none"
			stroke="currentColor"
			strokeWidth={2}
			strokeLinecap="round"
			strokeLinejoin="round"
			aria-hidden="true"
			{...props}
		>
			<polyline points="9 18 15 12 9 6" />
		</svg>
	)
}
