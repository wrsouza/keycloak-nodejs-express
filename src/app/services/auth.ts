import { ServerError, UnauthorizeError } from '~/errors'
import { Service } from './service'

type LoginParams = { 
  username: string
  password: string
}

export class AuthService extends Service {
  async login({ username, password }: LoginParams) {
    try {
      const { data } = await this.keycloakRequest({
        method: 'POST',
        pathUrl: 'protocol/openid-connect/token',
        params: {
          username,
          password,
          'grant_type': 'password'
        }
      })
      return data
    } catch(err: any) {
      if (err.response.status === 401) {
        throw new UnauthorizeError('username or password invalid')
      }
      throw new ServerError(err)
    }
  }
}