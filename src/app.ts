import bodyparser from 'body-parser'
import express from 'express'
import helmet from 'helmet'

import { CommonRoutes, SERVER_PORT } from '@common/index'
import { AuthRoutes, UserRoutes } from '@routes/index'

const app: express.Application = express()
app.use(bodyparser.json({ limit: '5mb' }))
app.use(helmet())

const routes: CommonRoutes[] = []
routes.push(new AuthRoutes(app))
routes.push(new UserRoutes(app))

app.get('/', (req: express.Request, res: express.Response) => {
  res.status(200).send(`Server running at port ${SERVER_PORT}`)
})

export default app
