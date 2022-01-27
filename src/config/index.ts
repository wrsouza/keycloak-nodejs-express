require('dotenv').config()

export default {
  port: process.env.PORT || 3000,
  keycloak: {
    url: process.env.KEYCLOAK_URL || '',
    realm: process.env.KEYCLOAK_REALM || '',
    client: process.env.KEYCLOAK_CLIENT || '',
    secret: process.env.KEYCLOAK_SECRET || '',
    admin: {
      username: process.env.KEYCLOAK_ADMIN_USER || '',
      password: process.env.KEYCLOAK_ADMIN_PASS || ''
    }
  }
}