interface Params {
  [key: string]: string[]
}

export class InvalidParamError extends Error {
  public status: number
  public body: Params

  constructor(params: Params) {
    super('Invalid Params')
    Object.setPrototypeOf(this, InvalidParamError.prototype);
    this.status = 400
    this.name = 'InvalidParamError'
    this.body = params
  }
}