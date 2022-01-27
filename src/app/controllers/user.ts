import { Request, Response } from 'express';
import { UserService } from '~/app/services';

const service = new UserService()

export const userController = {
  async index(req: Request, res: Response) {
    const result = await service.index(req.query)
    res.json(result)
  },

  async store(req: Request, res: Response) {
    const result = await service.store(req.body)
    res.status(201).json(result)
  },

  async show(req: Request, res: Response) {
    const { id } = req.params
    const result = await service.show(id)
    res.json(result)
  },

  async update(req: Request, res: Response) {
    const { id } = req.params
    const result = await service.update({ ...req.body, id })
    res.json(result)
  },

  async destroy(req: Request, res: Response) {
    const { id } = req.params
    const result = await service.destroy(id)
    res.json(result)
  },

  async changePassword(req: Request, res: Response) {
    const { id } = req.params
    const { password } = req.body
    const result = await service.changePassword({ id, password })
    res.json(result)
  },
}