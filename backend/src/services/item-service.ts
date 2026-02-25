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
}
