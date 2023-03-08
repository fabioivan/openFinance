import { Application } from 'express'

export abstract class CommonRoutes {
  protected app: Application

  private readonly name: string

  protected constructor(app: Application, name: string) {
    this.app = app
    this.name = name
    this.configureRoutes()
  }

  public getName(): string {
    return this.name
  }

  protected abstract configureRoutes(): void
}
