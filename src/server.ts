import express, { Application, json } from 'express'
import cors from 'cors'
import helmet from 'helmet'

import routes from '~/routes'
import { errorHandler } from '~/app/middlewares'

const server: Application = express()

server.use(json())
server.use(cors())
server.use(helmet())
server.use(routes)
server.use(errorHandler)

export default server