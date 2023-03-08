import mongoose from 'mongoose'

import { logger } from '../util/logger'
import { MONGODB_URI } from '../util/secrets'

export class MongooseService {
  // eslint-disable-next-line no-use-before-define
  private static instance: MongooseService

  private options = {
    autoIndex: false,
    poolSize: 10,
    bufferMaxEntries: 0,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }

  count = 0

  public constructor() {
    this.connectWithRetry()
  }

  public static getInstance(): MongooseService {
    if (!this.instance) {
      this.instance = new MongooseService()
    }
    return this.instance
  }

  public getMongoose() {
    return mongoose
  }

  private connectWithRetry() {
    logger.debug('MongoDB connection with retry')
    mongoose
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      .connect(MONGODB_URI!, this.options)
      .then(() => {
        logger.info('MongoDB is connected')
      })
      .catch(err => {
        logger.error(
          `MongoDB connection unsuccessful, retry after 5 seconds. Retry count=${this.count}`
        )
        logger.error(err)
        setTimeout(this.connectWithRetry, 5000)
      })
  }
}
