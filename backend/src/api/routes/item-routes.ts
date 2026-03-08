import { Router } from 'express'
import { authenticateToken } from '../middlewares/auth-middleware'
import { createItem, deleteItem, getItems, updateItem } from '../controllers/item-controller'

const router = Router()
router.use(authenticateToken)

router.post('/', createItem)
router.get('/', getItems)
router.put('/:id', updateItem)
router.delete('/:id', deleteItem)

export default router
