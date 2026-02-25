import prisma from '../infrastructure/prisma'

export class LoanService {
  async createLoan(itemId: string, borrowerId: string) {
    return await prisma.$transaction(async (tx) => {
      const item = await tx.item.findUnique({ where: { id: itemId } })
      if (!item || item.status !== 'AVAILABLE') {
        throw new Error('El equipo no está disponible para préstamo')
      }

      const loan = await tx.loan.create({
        data: {
          itemId,
          borrowerId,
          startDate: new Date()
        }
      })

      await tx.item.update({
        where: { id: itemId },
        data: { status: 'IN_USE' }
      })

      return loan
    })
  }

  async returnLoan(loanId: string) {
    return await prisma.$transaction(async (tx) => {
      const loan = await tx.loan.findUnique({ where: { id: loanId } })
      if (!loan || loan.returnDate) {
        throw new Error('Préstamo no encontrado o ya devuelto')
      }

      const updatedLoan = await tx.loan.update({
        where: { id: loanId },
        data: { returnDate: new Date() }
      })

      await tx.item.update({
        where: { id: loan.itemId },
        data: { status: 'AVAILABLE' }
      })

      return updatedLoan
    })
  }

  async getCompanyLoans(companyId: string) {
    return await prisma.loan.findMany({
      where: {
        item: { companyId }
      },
      include: {
        item: true,
        borrower: true
      },
      orderBy: { startDate: 'desc' }
    })
  }
}
