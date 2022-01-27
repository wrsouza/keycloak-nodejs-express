export class ServerError extends Error {
  public status: number
  public body: any
  
  constructor(err: any) {
    super('Server Error')
    Object.setPrototypeOf(this, ServerError.prototype);
    this.status = 500
    this.name = 'ServerError'
    this.body = err
  }
}