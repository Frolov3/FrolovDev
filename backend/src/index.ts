import app from "./app"
import seedData from "./db/seed"
import logger from "./utils/logger"

await seedData()

const PORT = process.env.PORT || 3000
app.listen(PORT, async () => {
	logger.info(`Server running on ${PORT} port`)
	console.log(`Server running on ${PORT} port`)
})
