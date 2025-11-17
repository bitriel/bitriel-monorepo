import 'dotenv/config'
import app from './app.js'
import { config } from './config.js'
import { connectDB } from './config/database.js'

const port = config.server.port

const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDB()

    // Start listening
    app.listen(port, () => {
      console.log(`API server listening on http://localhost:${port}`)
      console.log(`Environment: ${process.env.NODE_ENV || 'development'}`)
    })
  } catch (error) {
    console.error('Failed to start server:', error)
    process.exit(1)
  }
}

startServer()
