import { Response } from 'express'
import { LoanService } from '../../services/loan-service'

const loanService = new LoanService()

export const startLoan = async (req: any, res: Response) => {
  try {
    const { itemId, borrowerId } = req.body
    const loan = await loanService.createLoan(itemId, borrowerId)
    res.status(201).json(loan)
  } catch (error: any) {
    res.status(400).json({ error: error.message })
  }
}

export const finishLoan = async (req: any, res: Response) => {
  try {
    const { id } = req.params
    const loan = await loanService.returnLoan(id)
    res.json(loan)
  } catch (error: any) {
    res.status(400).json({ error: error.message })
  }
}

export const getAllLoans = async (req: any, res: Response) => {
  try {
    const loans = await loanService.getCompanyLoans(req.user.companyId)
    res.json(loans)
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
}
