import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"
import multer from "multer"

export class UnsupportedFileTypeError extends Error {
	constructor() {
		super(
			"Unsupported file format. Allowed: jpg, jpeg, png, webp, pdf, zip, fig, txt, md, doc, docx",
		)
		this.name = "UnsupportedFileTypeError"
	}
}

const uploadDir = fileURLToPath(new URL("../../uploads", import.meta.url))
const allowedExtensions = new Set([
	".jpg",
	".jpeg",
	".png",
	".webp",
	".pdf",
	".zip",
	".fig",
	".txt",
	".md",
	".doc",
	".docx",
])
const allowedMimeTypes = new Set([
	"image/jpeg",
	"image/png",
	"image/webp",
	"application/pdf",
	"application/zip",
	"application/x-zip-compressed",
	"application/octet-stream",
	"text/plain",
	"text/markdown",
	"application/msword",
	"application/vnd.openxmlformats-officedocument.wordprocessingml.document",
])

fs.mkdirSync(uploadDir, { recursive: true })

const storage = multer.diskStorage({
	destination: (_req, _file, cb) => {
		cb(null, uploadDir)
	},
	filename: (_req, file, cb) => {
		const extension = path.extname(file.originalname)
		const baseName = path
			.basename(file.originalname, extension)
			.toLowerCase()
			.replace(/[^a-z0-9]+/g, "-")
			.replace(/(^-|-$)/g, "")

		const safeBaseName = baseName || "file"
		const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`

		cb(null, `${safeBaseName}-${uniqueSuffix}${extension.toLowerCase()}`)
	},
})

const uploadFiles = multer({
	storage,
	limits: {
		fileSize: 25 * 1024 * 1024,
		files: 10,
	},
	fileFilter: (_req, file, cb) => {
		const extension = path.extname(file.originalname).toLowerCase()
		const isAllowedExtension = allowedExtensions.has(extension)
		const isAllowedMimeType = allowedMimeTypes.has(file.mimetype)

		if (!isAllowedExtension || !isAllowedMimeType) {
			return cb(new UnsupportedFileTypeError())
		}

		cb(null, true)
	},
})

export default uploadFiles
