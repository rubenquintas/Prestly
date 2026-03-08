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

  async getCompanyItems(companyId: string, search?: string, status?: string) {
    return await prisma.item.findMany({
      where: {
        companyId,
        name: search ? { contains: search, mode: 'insensitive' } : undefined,
        status: status ? (status as any) : undefined
      },
      orderBy: { updatedAt: 'desc' }
    })
  }

  async updateItem(id: string, companyId: string, data: { name?: string; status?: string }) {
    return await prisma.item.update({
      where: { id, companyId },
      data: {
        name: data.name,
        status: data.status as any
      }
    })
  }

  async deleteItem(id: string, companyId: string) {
    const loansCount = await prisma.loan.count({
      where: { itemId: id, companyId }
    })

    if (loansCount > 0) {
      throw new Error('ITEM_HAS_ACTIVE_LOANS')
    }

    return await prisma.item.delete({
      where: { id, companyId }
    })
  }
}
