import { Request } from "express";

interface User {
  id: string
  name: string
  username: string
  email: string
  roles: string[]
}

interface State {
  user?: User
}

declare module "express-serve-static-core" {
  interface Request {
    state: State;
  }
}