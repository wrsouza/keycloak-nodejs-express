import { Router, Request, Response, NextFunction } from 'express'
import { authController, homeController, userController } from '~/app/controllers'
import { keycloakAuthentication } from '~/app/middlewares'

const router = Router()

const use = (fn: any) => 
  (req: Request, res: Response, next: NextFunction) => 
  Promise.resolve(fn(req, res, next)).catch(next)

router.get('/', use(homeController.index))

router.get('/auth', [keycloakAuthentication], use(authController.get))
router.post('/auth', use(authController.login))

router.get('/user', [keycloakAuthentication], use(userController.index))
router.post('/user', [keycloakAuthentication], use(userController.store))
router.get('/user/:id', [keycloakAuthentication], use(userController.show))
router.put('/user/:id', [keycloakAuthentication], use(userController.update))
router.delete('/user/:id', [keycloakAuthentication], use(userController.destroy))
router.put('/user/:id/change-password', [keycloakAuthentication], use(userController.changePassword))

export default router