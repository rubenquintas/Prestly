import { Router } from 'express'
import { authenticateToken } from '../middlewares/auth-middleware'
import {
  createBorrower,
  createDept,
  deleteBorrower,
  getBorrowers,
  getDepts,
  updateBorrower
} from '../controllers/borrower-controller'

const router = Router()
router.use(authenticateToken)

router.post('/departments', createDept)
router.get('/departments', getDepts)
router.post('/', createBorrower)
router.get('/', getBorrowers)
router.put('/:id', updateBorrower)
router.delete('/:id', deleteBorrower)

export default router
