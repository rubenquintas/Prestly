# 🛠️ Prestly - Sistema de Gestión de Préstamos y Activos
 
**Prestly** es una aplicación Full-Stack multitenant diseñada para gestionar el flujo de préstamos de artículos de forma eficiente y visual.
 
![Tech Stack](https://img.shields.io/badge/Stack-React%20%7C%20Node.js%20%7C%20Prisma%20%7C%20PostgreSQL-blue)
 
---
 
## 🚀 Características Principales
 
- **Dashboard Inteligente**
- **Gestión Multitenant**
- **Inventario Dinámico**
- **Control de Préstamos**
- **Diseño Moderno**
 
---
 
## 📋 Requisitos Previos
 
Antes de empezar, asegúrate de tener instalado:
- [Node.js](https://nodejs.org/) (Versión 18 o superior)
- [PostgreSQL](https://www.postgresql.org/) (o una cuenta en [Neon.tech](https://neon.tech/))
- [Git](https://git-scm.com/)
 
---
 
## ⚙️ Instalación y Puesta en Marcha
 
Sigue estos pasos para configurar el proyecto en tu entorno local.
 
### 1. Clonar el repositorio
```bash
git clone https://github.com/RubenQuintasN/prestly.git
cd prestly
```
 
### 2. Configuración del Backend
Entra en la carpeta del servidor e instala las dependencias:
```bash
cd backend
npm install
```
 
**Configurar variables de entorno:**
Crea un archivo `.env` en la raíz de la carpeta `backend` con el siguiente contenido:
```env
DATABASE_URL="tu_url_de_conexion_a_postgres_o_neon"
JWT_SECRET="una_clave_secreta_segura"
PORT=3000
```
 
**Sincronizar la Base de Datos con Prisma:**
```bash
npx prisma generate
npx prisma migrate dev --name init
```
 
### 3. Configuración del Frontend
Abre una nueva terminal, entra en la carpeta del cliente e instala las dependencias:
```bash
cd frontend
npm install
```
 
---
 
## 🏃‍♂️ Ejecución del Proyecto
 
Para que la aplicación funcione, ambos servicios deben estar corriendo simultáneamente:
 
### Levantar el Backend
Desde la carpeta `backend`:
```bash
npm run dev
```
*El servidor estará disponible en `http://localhost:3000`*
 
### Levantar el Frontend
Desde la carpeta `frontend`:
```bash
npm run dev
```
*La aplicación web estará disponible en `http://localhost:5173`*
 
---
