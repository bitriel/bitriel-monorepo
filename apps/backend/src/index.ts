import 'dotenv/config'
import app from './app.js'
import { config } from './config.js'

const port = config.server.port

app.listen(port, () => {
  console.log(`API server listening on http://localhost:${port}`)
})
