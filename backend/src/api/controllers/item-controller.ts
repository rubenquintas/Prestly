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

export const updateItem = async (req: any, res: Response) => {
  const { id } = req.params
  const { companyId } = req.user as any
  try {
    const item = await itemService.updateItem(id, companyId, req.body)
    res.json(item)
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar el equipo' })
  }
}

export const deleteItem = async (req: any, res: Response) => {
  const { id } = req.params
  const { companyId } = req.user as any
  try {
    await itemService.deleteItem(id, companyId)
    res.status(204).send()
  } catch (error: any) {
    const message =
      error.message === 'ITEM_HAS_ACTIVE_LOANS'
        ? 'No se puede eliminar un equipo con préstamos'
        : 'Error al eliminar'
    res.status(400).json({ error: message })
  }
}
