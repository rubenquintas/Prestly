import { Response } from 'express'
import { ItemService } from '../../services/item-service'

const itemService = new ItemService()

export const createItem = async (req: any, res: Response) => {
  try {
    const item = await itemService.createItem(req.user.companyId, req.body.name)
    res.status(201).json(item)
  } catch (error: any) {
    res.status(400).json({ error: error.message })
  }
}

export const getItems = async (req: any, res: Response) => {
  try {
    const { search, status } = req.query
    const items = await itemService.getCompanyItems(
      req.user.companyId,
      search as string,
      status as string
    )
    res.json(items)
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
}
