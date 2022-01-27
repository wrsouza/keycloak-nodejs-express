export class UnauthorizeError extends Error {
  public status: number
  
  constructor(message: string = 'Unauthorized') {
    super(message)
    Object.setPrototypeOf(this, UnauthorizeError.prototype);
    this.status = 401
    this.name = 'UnauthorizeError'
  }
}