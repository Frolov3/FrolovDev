import pino from "pino"

const logger = pino({
	transport: {
		target: "pino/file",
		options: { destination: "./logs/app.log" },
	},
})

logger.level = "debug"

export default logger
