import { Request, Response } from "express";
import { AuthService } from "~/app/services";

const service = new AuthService()

export const authController = {
  get(req: Request, res: Response) {
    const { user } = req.state
    res.json(user)
  },
  async login(req: Request, res: Response) {
    const { username, password } = req.body
    const result = await service.login({ username, password })
    res.json(result)
  }
}