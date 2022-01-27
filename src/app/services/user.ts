import { InvalidParamError, NotFoundError, ServerError } from "~/errors";
import { Service } from "./service";

interface StoreParams {
  firstName: string
  lastName: string
  username: string
  email: string
  password: string
}

interface UpdateParams {
  id: string
  firstName: string
  lastName: string
  email: string
}

interface PasswordParams {
  id: string
  password: string
}

interface QueryString {
  [key: string]: any
}

export class UserService extends Service {
  async index(query: QueryString) {
    try {
      const queryString = []
      for(let key of Object.keys(query)) {
        queryString.push(`${key}=${query[key]}`)
      }
      const { data } = await this.keycloakAdminRequest({
        method: 'GET',
        pathUrl: `users?${queryString.join("&")}`
      })
      return data.map((item: any) => ({
        id: item.id,
        firstName: item.firstName,
        lastName: item.lastName,
        username: item.username,
        email: item.email
      }))
    } catch(err) {
      throw new ServerError(err)
    }
  }

  async checkUserExists(username: string) {
    try {
      const data = await this.index({ username })
      return !!data.length
    } catch (err) {
      throw new ServerError(err)
    }
  }

  async store({ firstName, lastName, username, email, password }: StoreParams) {
    try {
      if (await this.checkUserExists(username)) {
        throw new InvalidParamError({ username: ['username already exists'] })
      }
      const response = await this.keycloakAdminRequest({
        method: 'POST',
        pathUrl: 'users',
        params: {
          firstName,
          lastName,
          username,
          email,
          enabled: true,
          credentials: [{ value: password, type: "password", temporary: false }],
        }
      })
      const userId: string = String(response.headers.location.split('/').pop())
      return this.show(userId)
    } catch(err) {
      if (err instanceof InvalidParamError) {
        throw err
      }
      throw new ServerError(err)
    }
  }

  async show(id: string) {
    try {
      const { data } = await this.keycloakAdminRequest({
        method: 'GET',
        pathUrl: `users/${id}`,
      })
      return {
        id: data.id,
        firstName: data.firstName,
        lastName: data.lastName,
        username: data.username,
        email: data.email
      }
    } catch(err: any) {
      if (err.response.status === 404) {
        throw new NotFoundError('User not found')
      }
      throw new ServerError(err)
    }
  }

  async update({ id, firstName, lastName, email }: UpdateParams) {
    try {
      const response = await this.keycloakAdminRequest({
        method: 'PUT',
        pathUrl: `users/${id}`,
        params: {
          firstName,
          lastName,
          email
        }
      })
      return this.show(id)
    } catch(err) {
      throw new ServerError(err)
    }
  }

  async destroy(id: string) {
    try {
      await this.keycloakAdminRequest({
        method: 'DELETE',
        pathUrl: `users/${id}`,
      })
      return { message: "ok" }
    } catch(err: any) {
      if (err.response.status === 404) {
        throw new NotFoundError('User not found')
      }
      throw new ServerError(err)
    }
  }

  async changePassword({ id, password }: PasswordParams) {
    try {
      const response = await this.keycloakAdminRequest({
        method: 'PUT',
        pathUrl: `users/${id}/reset-password`,
        params: {
          value: password,
          type: "password",
          temporary: false
        }
      })
      console.log(response)
      return this.show(id)
    } catch(err) {
      throw new ServerError(err)
    }
  }
}