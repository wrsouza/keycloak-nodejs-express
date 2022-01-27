export class NotFoundError extends Error {
  public status: number
  
  constructor(message: string) {
    super(message)
    Object.setPrototypeOf(this, NotFoundError.prototype);
    this.status = 404
    this.name = 'NotFoundError'
  }
}