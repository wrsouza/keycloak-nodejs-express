import { NextFunction, Request, Response } from "express"
import config from "~/config"
import { ServerError, UnauthorizeError } from "~/errors"
import { KeycloakRequest } from "~/utils"

export const keycloakAuthentication = async (req: Request, res: Response, next: NextFunction) => {
  const { authorization } = req.headers
  if (!authorization || authorization.indexOf('Bearer') === -1) {
    return res.status(401).json({ message: 'Invalid token' })
  }
  const token: string = authorization.replace('Bearer', '').trim()
  const { data } = await KeycloakRequest({
    method: 'POST',
    pathUrl: 'protocol/openid-connect/token/introspect',
    params: {
      token
    }
  })
  if (data.active) {
    const user = {
      id: data.sub,
      name: data.name,
      username: data.username,
      email: data.email,
      roles: data.realm_access.roles
    }
    req.state = {
      user
    }
    return next()
  }
  return res.status(401).json({ message: 'Unauthorized' })
}