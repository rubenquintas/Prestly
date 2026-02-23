import prisma from '../infrastructure/prisma'

export class ItemService {
  async createItem(companyId: string, name: string) {
    return await prisma.item.create({
      data: {
        name,
        companyId,
        status: 'AVAILABLE'
      }
    })
  }

  async getCompanyItems(companyId: string) {
    return await prisma.item.findMany({
      where: { companyId },
      include: { loans: true }
    })
  }
}
