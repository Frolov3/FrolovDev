import app from "./app"
import seedData from "./db/seed"

await seedData()

const PORT = process.env.PORT || 3000
app.listen(PORT, async () => {
	console.log(`Server running on ${PORT} port`)
})
