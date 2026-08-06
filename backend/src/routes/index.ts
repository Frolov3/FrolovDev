import express from "express"
import OrderController from "../controllers/OrderController"
import orderRateLimit from "../middleware/orderRateLimit"
import uploadFiles from "../middleware/uploadFiles"
import BudgetController from "../controllers/BudgetController"
import ProjectTypeController from "../controllers/ProjectTypeController"
import UrgencyController from "../controllers/UrgencyController"
import LetterController from "../controllers/LetterController"

const router = express.Router()

router.post(
	"/order",
	orderRateLimit,
	uploadFiles.array("files", 10),
	OrderController.create,
)

router.get("/budget", BudgetController.index)
router.get("/project-type", ProjectTypeController.index)
router.get("/urgency", UrgencyController.index)
router.get("/letter", LetterController.get)
router.post("/letter/log", LetterController.log)

export default router
