import { Router } from 'express'
import { authenticateToken } from '../middlewares/auth-middleware'
import { createItem, getItems } from '../controllers/item-controller'

const router = Router()
router.use(authenticateToken)

router.post('/', createItem)
router.get('/', getItems)

export default router
