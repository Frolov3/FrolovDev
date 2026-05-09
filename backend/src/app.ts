import { fileURLToPath } from "node:url"
import express, { Request, Response, NextFunction } from "express"
import multer from "multer"
import { UnsupportedFileTypeError } from "./middleware/uploadFiles"
import router from "./routes"

const app = express()
const uploadsPath = fileURLToPath(new URL("../uploads", import.meta.url))

app.use(express.json())
app.use("/uploads", express.static(uploadsPath))
app.use("/api", router)

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
	if (err instanceof multer.MulterError) {
		return res.status(400).json({
			error: "Upload error",
			message: err.message,
		})
	}

	if (err instanceof UnsupportedFileTypeError) {
		return res.status(400).json({
			error: "Upload error",
			message: err.message,
		})
	}

	const message = err instanceof Error ? err.message : "Unknown error"

	res.status(500).json({
		error: "Error",
		message,
	})
})

export default app
