console.log('--- Iniciando servidor de Prestly ---')

import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import authRoutes from './api/routes/auth-routes'
import itemRoutes from './api/routes/item-routes'
import borrowerRoutes from './api/routes/borrower-routes'
import loanRoutes from './api/routes/loan-routes'
import dashboardRoutes from './api/routes/dashboard-routes'
import { authenticateToken } from './api/middlewares/auth-middleware'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000

app.use(cors())
app.use(express.json())

app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`)
  next()
})

app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'Prestly API',
    database: 'Connected (Neon)'
  })
})

app.use('/api/auth', authRoutes)
app.use('/api/items', itemRoutes)
app.use('/api/borrowers', borrowerRoutes)
app.use('/api/loans', loanRoutes)

app.use('/api/dashboard', dashboardRoutes)

app.get('/api/protected-test', authenticateToken, (req: any, res) => {
  res.json({
    message: 'Acceso concedido',
    user: req.user
  })
})

app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' })
})

app.listen(PORT, () => {
  console.log(`
        Prestly Backend en marcha
        -------------------------
        Puerto: ${PORT}
        Entorno: Desarrollo
        -------------------------
        `)
})
