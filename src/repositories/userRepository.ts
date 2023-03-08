import shortUUID from 'short-uuid'

import { MongooseService } from '@common/services/mongooseService'
import { generateSecurePassword } from '@utils/index'

export class UsersRepository {
  private mongooseService: MongooseService = MongooseService.getInstance()

  // eslint-disable-next-line no-use-before-define
  private static instance: UsersRepository

  private Schema = this.mongooseService.getMongoose().Schema

  private userSchema = new this.Schema({
    _id: String,
    name: String,
    email: String,
    description: String,
    password: String,
    permissionLevel: Number,
  })

  private User = this.mongooseService
    .getMongoose()
    .model('Users', this.userSchema)

  public constructor() {
    // this.addAdminUser();
  }

  public async addAdminUser() {
    const adminUser = await this.User.findOne({ email: 'admin@email.com' })
    if (adminUser == null) {
      console.log('Creating user - admin')
      const admin = {
        name: 'admin',
        email: 'admin@email.com',
        description: 'Application admin user',
        password: await generateSecurePassword(Buffer.from('admin')),
        permissionLevel: 8192,
      }
      await this.addUser(admin)
    }
  }

  public static getInstance(): UsersRepository {
    if (!this.instance) {
      this.instance = new UsersRepository()
    }
    return this.instance
  }

  public async addUser(userFields: any): Promise<shortUUID.SUUID> {
    const model = userFields
    model._id = shortUUID.generate()
    const user = new this.User(model)
    await user.save()
    return model._id
  }

  public async getUserByEmail(email: string) {
    return this.User.findOne({ email })
  }

  public async removeUserById(userId: string) {
    await this.User.deleteOne({ _id: userId })
  }

  public async getUserById(userId: string) {
    return this.User.findOne({ _id: userId })
  }

  public async listUsers(limit = 25, page = 0) {
    return this.User.find()
      .limit(limit)
      .skip(limit * page)
      .exec()
  }

  // eslint-disable-next-line consistent-return
  public async patchUser(userFields: any): Promise<any> {
    const user: any = await this.User.findById(userFields.id)
    if (user) {
      // eslint-disable-next-line guard-for-in
      for (const i in userFields) {
        user[i] = userFields[i]
      }
      return user.save()
    }
  }
}
