import { ErrorRequestHandler, Request, Response, NextFunction } from 'express'
import { InvalidParamError, NotFoundError, ServerError, UnauthorizeError } from '~/errors'

export const errorHandler = (
  err: ErrorRequestHandler,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof NotFoundError || err instanceof UnauthorizeError) {
    res.status(err.status)
    res.statusMessage = err.name
    return res.json({ message: err.message })
  }
  
  if (err instanceof ServerError || err instanceof InvalidParamError) {
    res.status(err.status)
    res.statusMessage = err.name
    return res.json(err.body)
  }

  res.status(500)
  res.statusMessage = 'Server Error'
  res.send(err.toString())
}