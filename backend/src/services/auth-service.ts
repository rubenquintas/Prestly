import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import prisma from '../infrastructure/prisma'

const JWT_SECRET = process.env.JWT_SECRET || 'falback_secret'

export class AuthService {
  async registerCompany(companyName: string, adminData: any) {
    const hashedPassword = await bcrypt.hash(adminData.password, 10)

    return await prisma.$transaction(async (tx) => {
      const company = await tx.company.create({
        data: { name: companyName }
      })

      const user = await tx.adminUser.create({
        data: {
          email: adminData.email,
          password: hashedPassword,
          name: adminData.name,
          companyId: company.id
        }
      })
      return { company, user }
    })
  }

  async login(email: string, pass: string) {
    const user = await prisma.adminUser.findUnique({
      where: { email },
      include: { company: true }
    })

    if (!user) throw new Error('Credenciales inválidas')

    const isMatch = await bcrypt.compare(pass, user.password)
    if (!isMatch) throw new Error('Credenciales inválidas')

    const token = jwt.sign({ userId: user.id, companyId: user.companyId }, JWT_SECRET, {
      expiresIn: '8h'
    })

    return { token, user: { name: user.name, email: user.email, company: user.company.name } }
  }
}
