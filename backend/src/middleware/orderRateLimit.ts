import rateLimit from "express-rate-limit"

const orderRateLimit = rateLimit({
	windowMs: 30 * 60 * 1000,
	limit: 5,
	standardHeaders: true,
	legacyHeaders: false,
	message: {
		success: false,
		message: "Too many orders from this IP, please try again later.",
	},
})

export default orderRateLimit
