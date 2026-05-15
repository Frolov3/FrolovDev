import SocialNetworkCard from "../components/ui/SocialNetworkCard"
import type socialNetwork from "../types/socialNetwork"

type HeroProps = {
	socialNetworks: socialNetwork[]
}

export default function Hero({ socialNetworks }: HeroProps) {
	return (
		<div className="relative min-h-screen overflow-hidden bg-[var(--black)] font-[var(--font)] flex flex-col justify-center gap-4 px-6 sm:px-10 lg:px-24">
			<div className="relative z-10 w-fit max-w-full mt-32">
				<h1 className="relative z-10 text-[var(--white)] font-extrabold uppercase text-[clamp(3.4rem,18vw,16.5rem)] leading-none tracking-[-6%] sm:-translate-1 md:-translate-2 lg:-translate-3">
					Frolov
				</h1>
				<h1 className="absolute -top-9 left-[calc(100%-0.72em)] text-[var(--dark-grey)] font-extrabold uppercase text-[clamp(3.4rem,18vw,16.5rem)] leading-none tracking-[-6%] select-none sm:-top-12 sm:left-[calc(100%-0.62em)] md:-top-18 lg:-top-28 xl:-top-36">
					Dev
				</h1>
			</div>
			<div className="z-10 flex flex-wrap gap-3 sm:gap-4.5">
				{socialNetworks.map((socialNetwork) => (
					<SocialNetworkCard
						socialNetwork={socialNetwork}
						key={socialNetwork.id}
					/>
				))}
			</div>
		</div>
	)
}
