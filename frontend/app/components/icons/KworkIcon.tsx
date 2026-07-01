import type IconProps from "@/app/types/iconProps"

export default function KworkIcon({ className = "" }: IconProps) {
	return (
		<svg
			width="21"
			height="22"
			viewBox="0 0 21 22"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			className={className}
		>
			<path
				d="M6.70213 21.89H1.89894V15.4L14.633 0H20.3298L11.617 10.34L21 22H15.1915L8.37766 13.2L6.70213 15.18V21.89Z"
				fill="currentColor"
			/>
			<path
				d="M6.36702 7.26L1.89894 11.99V2.97H0V0H6.36702V7.26Z"
				fill="currentColor"
			/>
		</svg>
	)
}
