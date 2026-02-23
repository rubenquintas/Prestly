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
    const { departmentId, name, email } = req.body
    const borrower = await borrowerService.createBorrower(departmentId, name, email)
    res.status(201).json(borrower)
  } catch (error: any) {
    res.status(400).json({ error: error.message })
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
