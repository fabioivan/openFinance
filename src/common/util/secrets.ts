import dotenv from 'dotenv'
import fs from 'fs'

import { logger } from './logger'

if (fs.existsSync('.env.dev')) {
  logger.debug('Using .env.dev file to supply config environment variables')
  dotenv.config({ path: '.env.dev' })
} else {
  logger.debug('Using .env file to supply config environment variables')
  dotenv.config({ path: '.env' })
}
export const ENVIRONMENT = process.env.NODE_ENV
// const prod = ENVIRONMENT === "production"; // Anything else is treated as 'dev'

export const SERVER_PORT = process.env.SERVER_PORT ?? '3000'

export const { JWT_SECRET } = process.env
export const { MONGODB_URI } = process.env

if (!JWT_SECRET) {
  logger.error('No jwt secret. Set JWT_SECRET environment variable.')
  process.exit(1)
}

if (!MONGODB_URI) {
  logger.error(
    'No mongo connection string. Set MONGODB_URI environment variable.'
  )
  process.exit(1)
}
