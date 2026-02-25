import { Router } from 'express'
import { authenticateToken } from '../middlewares/auth-middleware'
import { getDashboardData } from '../controllers/dashborad-controller'

const router = Router()
router.use(authenticateToken)

router.get('/stats', getDashboardData)

export default router
