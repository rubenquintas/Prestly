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

  async createBorrower(departmentId: string, name: string, email?: string) {
    return await prisma.borrower.create({
      data: { name, email, departmentId }
    })
  }

  async getBorrowersByCompnay(companyId: string) {
    return await prisma.borrower.findMany({
      where: { department: { companyId } },
      include: { department: true }
    })
  }
}
