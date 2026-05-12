import socialNetwork from "../types/socialNetwork"

type FooterProps = {
	socialNetworks: socialNetwork[]
}

export default function Footer({ socialNetworks }: FooterProps) {
	return (
		<footer className="sm:h-36 bg-[var(--white)] px-8 sm:px-24 flex-col-reverse sm:flex-row gap-4 pt-2 flex justify-between items-center">
			<div className="uppercase font-extrabold text-[var(--black)] -tracking-[6%] text-6xl">
				Frolov
			</div>
			<div className="flex items-center justify-center gap-6">
				{socialNetworks.map((socialNetwork) => (
					<a
						className="flex items-center justify-center hover:opacity-50 duration-300"
						key={socialNetwork.id}
						href={socialNetwork.link}
						target="_blank"
					>
						{socialNetwork.icon}
					</a>
				))}
			</div>
		</footer>
	)
}
