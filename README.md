# 🛒 Ecommerce de Pedidos Online: EL BUEN SABOR — Frontend

Este es el repositorio del frontend del sistema de ecommerce de pedidos online desarrollado como proyecto final para la Tecnicatura Universitaria en Programación. Está construido con React + TypeScript utilizando Vite, y permite a distintos roles (cliente, cajero, cocinero, delivery, administrador) interactuar con la plataforma según sus funcionalidades específicas.

---

## 🚀 Tecnologías utilizadas

- ⚛️ React 19 + Vite
- 🔷 TypeScript
- 📡 Fetch y Axios para consumo de API (predomina Fetch)
- 🔐 Auth0 para autenticación de usuarios
- 🔀 React Router DOM v7 para navegación por rutas
- 📊 React Google Charts
- 📦 Redux Toolkit y React Redux
- 🎨 React Icons
- 💳 SDK de Mercado Pago (React)
- 🧪 ESLint con soporte para React y TypeScript

> ⚠️ Bootstrap está instalado pero no fue utilizado activamente en el proyecto.

---

## ⚙️ Instrucciones de instalación y ejecución

### Requisitos previos

- Node.js (versión recomendada: 18+)
- Tener el backend corriendo en el puerto `8080`
- Este frontend se sirve por defecto en `http://localhost:5173`
- Instalar dependencias: npm install
- Ejecutar en entorno de desarrollo: npm run dev
- El proyecto no requiere configuración de variables de entorno (.env), pero se espera que el backend esté corriendo localmente y permita CORS desde el puerto 5173.

---

🧱 Estructura y módulos implementados
El sistema está compuesto por múltiples vistas según el rol del usuario:

🧑‍💼 Cliente
- Landing page pública
- Registro e inicio de sesión obligatorio para realizar pedidos
- Carrito de compras y visualización de productos

⚙️ Administrador
- Dashboard principal con acceso completo a:
- ABM de artículos manufacturados
- ABM de artículos insumo
- ABM de categorías (rubros) para ambos tipos
- ABM de empleados y clientes
- Facturación
- Reportes con gráficos

💵 Cajero
- Vista de gestión de pedidos:
- Envío de pedidos a cocina
- Envío a delivery
- Cancelación o rechazo de pedidos

👨‍🍳 Cocinero
- Visualización de pedidos pendientes de preparación
- Control de stock
- ABM de artículos relacionados con cocina

🛵 Delivery
- Vista con pedidos en estado “En delivery”
- Marcado de pedidos como entregados

---

👨‍👩‍👧‍👦 Integrantes del grupo
- Araujo, Agustina	
- Barolo, Ignacio	
- Ibarra, Enzo	
- Martin, Betsabé	
- Padilla, Bruno	
- Videla, Santiago	

---

📌 Notas finales
- Este repositorio forma parte de un sistema completo que incluye también un backend desarrollado en Spring Boot.
  Para su correcto funcionamiento, ambos deben estar corriendo simultáneamente.
