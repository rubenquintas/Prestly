import prisma from '../infrastructure/prisma'

export class DashboardService {
  async getStats(companyId: string) {
    const now = new Date()
    const startOfToday = new Date(now.setHours(0, 0, 0, 0))
    const endOfToday = new Date(now.setHours(23, 59, 59, 999))

    const overdueCount = await prisma.loan.count({
      where: {
        item: { companyId },
        returnDate: null,
        dueDate: { lt: new Date() }
      }
    })

    const outOfServiceCount = await prisma.item.count({
      where: {
        companyId,
        status: { in: ['REPAIRING'] }
      }
    })

    const expiringToday = await prisma.loan.findMany({
      where: {
        item: { companyId },
        returnDate: null,
        dueDate: {
          gte: startOfToday,
          lte: endOfToday
        }
      },
      include: {
        item: true,
        borrower: {
          include: { department: true }
        }
      }
    })

    return {
      overdueCount,
      outOfServiceCount,
      expiringToday
    }
  }

  async getWeeklyStats(companyId: string) {
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

    const loans = await prisma.loan.findMany({
      where: {
        item: { companyId },
        startDate: { gte: sevenDaysAgo }
      },
      select: { startDate: true }
    })

    const stats = loans.reduce((acc: any, loan) => {
      const date = loan.startDate.toISOString().split('T')[0]
      acc[date] = (acc[date] || 0) + 1
      return acc
    }, {})

    return stats
  }
}
