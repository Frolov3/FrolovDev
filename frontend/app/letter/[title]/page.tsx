import { Letter } from "@/app/types/letter"
import EnvelopeLetter from "./components/Letter"
import AudioPlayer from "./components/AudioPlayer"
import { getApiUrl } from "@/app/lib/api"
import { redirect } from "next/navigation"

async function fetchLetter({ title }: { title: string }): Promise<Letter> {
	const res = await fetch(
		`${getApiUrl()}/api/letter?title=${encodeURIComponent(title)}`,
		{
			cache: "no-store",
		},
	)

	if (res.status === 404) {
		redirect("/")
	}

	if (!res.ok) {
		throw new Error(`Failed to load: ${res.status}`)
	}

	const data = await res.json()

	if (!data.letter) {
		redirect("/")
	}

	return data.letter
}

export default async function LetterPage({
	params,
}: {
	params: Promise<{ title: string }>
}) {
	const { title } = await params

	const letter = await fetchLetter({ title: title })

	const pages = letter.messages
		.sort((a, b) => a.order - b.order)
		.map((message) => message.text.split("\n").filter(Boolean))
	const buttons = letter.buttons.sort((a, b) => a.order - b.order)

	if (pages.length === 0 || pages.every((page) => page.length === 0)) {
		redirect("/")
	}

	return (
		<div className="flex min-h-screen flex-col items-center justify-center pb-28">
			<EnvelopeLetter pages={pages} title={title} buttons={buttons} />
			<AudioPlayer musics={letter.music} />
		</div>
	)
}
