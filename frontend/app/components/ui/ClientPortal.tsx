"use client"
import { type ReactNode, useSyncExternalStore } from "react"
import { createPortal } from "react-dom"

type ClientPortalProps = {
	children: ReactNode
}

function subscribe() {
	return () => {}
}

function getPortalRoot() {
	return document.body
}

function getServerSnapshot() {
	return null
}

function ClientPortal({ children }: ClientPortalProps) {
	const portalRoot = useSyncExternalStore(
		subscribe,
		getPortalRoot,
		getServerSnapshot,
	)

	if (!portalRoot) {
		return null
	}

	return createPortal(children, portalRoot)
}

export default ClientPortal
