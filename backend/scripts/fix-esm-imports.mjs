import { access, readFile, readdir, stat, writeFile } from "node:fs/promises"
import path from "node:path"
import { fileURLToPath } from "node:url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const distDir = path.resolve(__dirname, "../dist")
const RUNTIME_EXTENSIONS = new Set([".js", ".mjs", ".cjs", ".json", ".node"])

const RELATIVE_SPECIFIER_REGEX =
	/(from\s+["'])(\.\.?\/[^"']+)(["'])|(import\s*\(\s*["'])(\.\.?\/[^"']+)(["']\s*\))/g

async function pathExists(targetPath) {
	try {
		await access(targetPath)
		return true
	} catch {
		return false
	}
}

async function resolveRuntimeSpecifier(filePath, specifier) {
	const extension = path.extname(specifier)
	if (RUNTIME_EXTENSIONS.has(extension)) {
		return specifier
	}

	const fileCandidate = path.resolve(path.dirname(filePath), `${specifier}.js`)
	if (await pathExists(fileCandidate)) {
		return `${specifier}.js`
	}

	const indexCandidate = path.resolve(path.dirname(filePath), specifier, "index.js")
	if (await pathExists(indexCandidate)) {
		return `${specifier}/index.js`
	}

	return specifier
}

async function rewriteFile(filePath) {
	const source = await readFile(filePath, "utf8")

	let changed = false
	const matches = [...source.matchAll(RELATIVE_SPECIFIER_REGEX)]

	if (matches.length === 0) {
		return false
	}

	let output = source
	for (const match of matches) {
		const prefix = match[1] ?? match[4]
		const specifier = match[2] ?? match[5]
		const suffix = match[3] ?? match[6]
		const rewrittenSpecifier = await resolveRuntimeSpecifier(filePath, specifier)

		if (rewrittenSpecifier === specifier) {
			continue
		}

		output = output.replace(`${prefix}${specifier}${suffix}`, `${prefix}${rewrittenSpecifier}${suffix}`)
		changed = true
	}

	if (!changed) {
		return false
	}

	await writeFile(filePath, output, "utf8")
	return true
}

async function collectJsFiles(dirPath) {
	const entries = await readdir(dirPath, { withFileTypes: true })
	const files = await Promise.all(
		entries.map(async (entry) => {
			const entryPath = path.join(dirPath, entry.name)

			if (entry.isDirectory()) {
				return collectJsFiles(entryPath)
			}

			return entry.isFile() && entry.name.endsWith(".js") ? [entryPath] : []
		}),
	)

	return files.flat()
}

async function main() {
	const distStats = await stat(distDir).catch(() => null)
	if (!distStats?.isDirectory()) {
		return
	}

	const jsFiles = await collectJsFiles(distDir)
	await Promise.all(jsFiles.map(rewriteFile))
}

await main()
