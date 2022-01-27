import { Request, Response } from "express";

export const homeController = {
  index(req: Request, res: Response) {
    res.send('Keycloak Admin Api')
  }
}