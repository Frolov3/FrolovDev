import { fileURLToPath } from "node:url"
import express, { Request, Response, NextFunction } from "express"
import multer from "multer"
import { UnsupportedFileTypeError } from "./middleware/uploadFiles"
import router from "./routes"
import logger from "./utils/logger"

const app = express()
const uploadsPath = fileURLToPath(new URL("../uploads", import.meta.url))

app.use((req, res, next) => {
	const start = Date.now()

	res.on("finish", () => {
		logger.info({
			method: req.method,
			url: req.url,
			status: res.statusCode,
			duration: Date.now() - start,
		})
	})

	next()
})

app.use(express.json())
app.use("/uploads", express.static(uploadsPath))
app.use("/api", router)

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
	logger.error({
		err: {
			message: err.message,
			stack: err.stack,
		},
		method: req.method,
		url: req.url,
	})

	if (err instanceof multer.MulterError) {
		return res.status(400).json({
			error: "Upload error",
			message: err.message,
		})
	}

	if (err instanceof UnsupportedFileTypeError) {
		return res.status(415).json({
			error: "Unsupported file type",
			message: err.message,
		})
	}

	return res.status(500).json({
		error: "Internal Server Error",
		message: "Something went wrong",
	})
})

export default app
