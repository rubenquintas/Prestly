import prisma from '../infrastructure/prisma'

export class LoanService {
  async createLoan(companyId: string, itemId: string, borrowerId: string, dueDate: string) {
    console.log(companyId, itemId, borrowerId, dueDate)

    return await prisma
      .$transaction(async (tx) => {
        const item = await tx.item.findUnique({ where: { id: itemId, companyId } })
        if (!item || item.status !== 'AVAILABLE') {
          throw new Error('El equipo no está disponible para préstamo')
        }

        const loan = await tx.loan.create({
          data: {
            itemId,
            borrowerId,
            companyId,
            startDate: new Date(),
            dueDate: new Date(dueDate),
            status: 'ACTIVE'
          }
        })

        await tx.item.update({
          where: { id: itemId },
          data: { status: 'IN_USE' }
        })

        return loan
      })
      .catch((err) => {
        console.error(err)
        throw new Error(err.message)
      })
  }

  async returnLoan(companyId: string, loanId: string) {
    return await prisma.$transaction(async (tx) => {
      const loan = await tx.loan.findUnique({ where: { id: loanId, companyId } })
      if (!loan || loan.returnDate) {
        throw new Error('Préstamo no encontrado o ya devuelto')
      }

      const updatedLoan = await tx.loan.update({
        where: { id: loanId },
        data: { returnDate: new Date(), status: 'RETURNED' }
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
        borrower: {
          include: { department: true }
        }
      },
      orderBy: { startDate: 'desc' }
    })
  }
}
