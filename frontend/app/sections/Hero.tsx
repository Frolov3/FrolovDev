import SocialNetworkCard from "../components/SocialNetworkCard"
import type socialNetwork from "../types/socialNetwork"

type HeroProps = {
	socialNetworks: socialNetwork[]
}

export default function Hero({ socialNetworks }: HeroProps) {
	return (
		<div className="h-screen bg-[var(--black)] font-[var(--font)] flex flex-col justify-center px-24">
			<h1 className="z-10 text-[var(--white)] font-extrabold uppercase text-[264px] tracking-[-6%]">
				Frolov
			</h1>
			<h1 className="absolute right-32 top-24 text-[var(--dark-grey)] font-extrabold uppercase text-[264px] tracking-[-6%] select-none">
				Dev
			</h1>
			<div className="flex gap-4.5">
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
