type Letter = {
	id: number
	title: string
	password: string | null
	messages: Message[]
	music: Music[]
	buttons: LetterButton[]
}

type Message = {
	id: number
	text: string
	order: number
	letterId: number
}

type Music = {
	id: number
	title: string
	path: string
	order: number
	letterId: number
}

type LetterButton = {
	id: number
	text: string
	order: number
	letterId: number
}

export default Letter
