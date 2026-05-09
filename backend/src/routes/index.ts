import express from "express"
import OrderController from "../controllers/OrderController"
import orderRateLimit from "../middleware/orderRateLimit"
import uploadFiles from "../middleware/uploadFiles"

const router = express.Router()

router.post(
	"/order",
	orderRateLimit,
	uploadFiles.array("files", 10),
	OrderController.create,
)

export default router
