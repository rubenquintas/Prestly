import { Router } from 'express'
import { authenticateToken } from '../middlewares/auth-middleware'
import { finishLoan, getAllLoans, startLoan } from '../controllers/loan-controller'

const router = Router()
router.use(authenticateToken)

router.post('/', startLoan)
router.patch('/:id/return', finishLoan)
router.get('/', getAllLoans)

export default router
