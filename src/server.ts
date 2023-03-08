import http from 'http'

import app from './app'
import { ENVIRONMENT, logger, SERVER_PORT } from './common'

const server: http.Server = http.createServer(app)
server.listen(SERVER_PORT, () => {
  logger.info(
    `Application is running at http://localhost:${SERVER_PORT} in ${ENVIRONMENT} mode`
  )
})

export default server
