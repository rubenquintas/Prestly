import prisma from '../infrastructure/prisma'

export class BorrowerService {
  async createDept(companyId: string, name: string) {
    return await prisma.department.create({
      data: { name, companyId }
    })
  }

  async getDepts(companyId: string) {
    return await prisma.department.findMany({
      where: { companyId }
    })
  }

  async createBorrower(
    companyId: string,
    data: { name: string; email: string; departmentId: string }
  ) {
    return await prisma.borrower.create({
      data: {
        name: data.name,
        email: data.email,
        departmentId: data.departmentId,
        companyId: companyId
      },
      include: { department: true }
    })
  }

  async getBorrowersByCompnay(companyId: string) {
    return await prisma.borrower.findMany({
      where: { department: { companyId } },
      include: { department: true }
    })
  }

  async updateBorrower(
    id: string,
    companyId: string,
    data: { name?: string; email?: string; departmentId?: string }
  ) {
    return await prisma.borrower.update({
      where: { id, companyId },
      data: {
        name: data.name,
        email: data.email,
        departmentId: data.departmentId
      },
      include: { department: true }
    })
  }

  async deleteBorrower(id: string, companyId: string) {
    const loansCount = await prisma.loan.count({
      where: { borrowerId: id, companyId }
    })

    if (loansCount > 0) {
      throw new Error('BORROWER_HAS_HISTORY')
    }

    return await prisma.borrower.delete({
      where: { id, companyId }
    })
  }
}
