import axios, { AxiosPromise, AxiosRequestConfig, Method } from "axios"
import config from "~/config"

interface KeycloakParams {
  [key: string]: any
}

interface KeycloakBody {
  method: Method
  pathUrl: string
  params?: KeycloakParams
}

let token: string = ""

const getConfig = ({ method, pathUrl, params }: KeycloakBody): AxiosRequestConfig => {
  const headers = {
    "Content-Type": "application/x-www-form-urlencoded"
  }
  const url = `${config.keycloak.url}/realms/${config.keycloak.realm}/${pathUrl}`
  const data = new URLSearchParams()
    data.append('client_id', config.keycloak.client)
    data.append('client_secret', config.keycloak.secret)
  if (params) {
    for (let key of Object.keys(params)) {
      data.append(key, params[key])
    }
  }  
  return {
    method,
    headers,
    data,
    url
  }
}

const getAdminConfig = ({ method, pathUrl, params }: KeycloakBody): AxiosRequestConfig => {
  const headers = {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${token}`
  }
  const url = `${config.keycloak.url}/admin/realms/${config.keycloak.realm}/${pathUrl}`
  const data = params
  return {
    method,
    headers,
    data,
    url,
  }
}

const keycloakGetToken = async () => {
  const { data } = await axios(getConfig({
    method: 'POST',
    pathUrl: 'protocol/openid-connect/token',
    params: {
      username: config.keycloak.admin.username,
      password: config.keycloak.admin.password,
      'grant_type': 'password'
    },
  }))
  console.log('new Token')
  token = data.access_token
  keycloakRefreshToken(data.expires_in, data.refresh_token)
}

const keycloakRefreshToken = (expireIn: number, refreshToken: string) => {
  setTimeout(() => {
    axios(getConfig({
      method: 'POST',
      pathUrl: 'protocol/openid-connect/token',
      params: {
        refresh_token: refreshToken,
        'grant_type': 'refresh_token'
      },
    })).then(({ data }) => {
      console.log('refresh Token')
      token = data.access_token
      keycloakRefreshToken(data.expires_in, data.refresh_token)
    }).catch(err => {
      token = ""
    })
  }, 1000 * expireIn)
}

const keycloakCheckToken = async () => {
  const { data } = await axios(getConfig({
    method: 'POST',
    pathUrl: 'protocol/openid-connect/token/introspect',
    params: {
      token
    }
  }))
  if (!data.active) {
    console.log('token Failed')
    await keycloakGetToken()
  } else {
    console.log('token Success')
  }
}

export const KeycloakRequest = (body: KeycloakBody): AxiosPromise<any> => {
  return axios(getConfig(body))
}

export const KeycloakAdminRequest = async (body: KeycloakBody) => {
  if (!token) {
    await keycloakGetToken()
  } else {
    await keycloakCheckToken()
  }
  return await axios(getAdminConfig(body))
}