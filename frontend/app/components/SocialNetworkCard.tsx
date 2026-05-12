import type socialNetwork from "../types/socialNetwork"

type socialNetworkCardProps = {
	socialNetwork: socialNetwork
}

export default function SocialNetworkCard({
	socialNetwork,
}: socialNetworkCardProps) {
	return (
		<a
			href={socialNetwork.link}
			target="_blank"
			className="h-8 md:h-11 border-2 font-bold border-[var(--white)] bg-var(--black) text-[var(--white)] hover:bg-[var(--white)] hover:text-[var(--black)] duration-300 px-3 py-1.5 flex justify-center items-center gap-2 md:gap-4 text-sm md:text-base"
		>
			{socialNetwork.icon} {socialNetwork.title}
		</a>
	)
}
