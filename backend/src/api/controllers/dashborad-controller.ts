import { Response } from 'express'
import { DashboardService } from '../../services/dashboard-service'

const dashBoardService = new DashboardService()

export const getDashboardData = async (req: any, res: Response) => {
  try {
    const stats = await dashBoardService.getStats(req.user.companyId)
    res.json(stats)
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
}
