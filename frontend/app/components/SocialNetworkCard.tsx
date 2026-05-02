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
			className="h-11 border-2 font-bold border-[var(--white)] bg-var(--black) text-[var(--white)] hover:bg-[var(--white)] hover:text-[var(--black)] duration-300 px-3 py-1.5 flex justify-center items-center gap-4"
		>
			{socialNetwork.icon} {socialNetwork.title}
		</a>
	)
}
