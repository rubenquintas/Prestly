import { Response } from 'express'
import { BorrowerService } from '../../services/borrower-service'

const borrowerService = new BorrowerService()

export const createDept = async (req: any, res: Response) => {
  try {
    const dept = await borrowerService.createDept(req.user.companyId, req.body.name)
    res.status(201).json(dept)
  } catch (error: any) {
    res.status(400).json({ error: error.message })
  }
}

export const getDepts = async (req: any, res: Response) => {
  try {
    const depts = await borrowerService.getDepts(req.user.companyId)
    res.json(depts)
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
}

export const createBorrower = async (req: any, res: Response) => {
  try {
    const { companyId } = req.user as any
    const { name, email, departmentId } = req.body

    if (!departmentId) {
      return res.status(400).json({ error: 'El departamento es obligatorio' })
    }

    const borrower = await borrowerService.createBorrower(companyId, { name, email, departmentId })
    res.status(201).json(borrower)
  } catch (error: any) {
    console.error('ERROR CREANDO BENEFICIARIO:', error)
    res.status(500).json({ error: 'No se pudo crear el beneficiario. ¿Email duplicado?' })
  }
}

export const getBorrowers = async (req: any, res: Response) => {
  try {
    const borrowers = await borrowerService.getBorrowersByCompnay(req.user.companyId)
    res.json(borrowers)
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
}

export const updateBorrower = async (req: any, res: Response) => {
  try {
    const { id } = req.params
    const { companyId } = req.user as any
    console.log(id, companyId, req.body)
    const borrower = await borrowerService.updateBorrower(id, companyId, req.body)
    res.json(borrower)
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar el beneficiario' })
  }
}

export const deleteBorrower = async (req: any, res: Response) => {
  try {
    const { id } = req.params
    const { companyId } = req.user as any
    await borrowerService.deleteBorrower(id, companyId)
    res.status(204).send()
  } catch (error: any) {
    const message =
      error.message === 'BORROWER_HAS_HISTORY'
        ? 'No se puede eliminar un beneficiario con historial de préstamos'
        : 'Error al eliminar beneficiario'
    res.status(400).json({ error: message })
  }
}
