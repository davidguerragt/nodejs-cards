# Credit Cards API

API REST construida con Express, TypeScript, arquitectura hexagonal, Prisma y MySQL.

## Requisitos

- Node.js 20 o superior
- Docker y Docker Compose, o una instancia MySQL 8

## Inicio local

1. Instala dependencias: `npm install`
2. Copia `.env.example` a `.env`.
3. Inicia MySQL: `docker compose up -d mysql`
4. Crea la base y genera el cliente: `npm run db:migrate -- --name init`
5. Inicia en desarrollo: `npm run dev`

La API queda disponible en `http://localhost:3000`; `GET /health` comprueba el estado.

## Endpoints

- `GET /api/cards`: listar tarjetas
- `GET /api/cards/:id`: obtener una tarjeta
- `POST /api/cards`: crear una tarjeta
- `PATCH /api/cards/:id`: actualizar campos
- `DELETE /api/cards/:id`: eliminar una tarjeta

Ejemplo de creación:

```json
{
  "holderName": "Ana Pérez",
  "cardNumber": "4111111111111111",
  "brand": "Visa",
  "securityCode": "123",
  "expirationMonth": 12,
  "expirationYear": 2030
}
```

## Estructura

- `domain`: entidad y puerto del repositorio
- `application`: casos de uso del CRUD
- `infrastructure`: cliente Prisma y adaptador MySQL
- `interfaces/http`: rutas, controladores, esquemas de validación y errores

La API valida que `cardNumber` coincida con `brand` mediante prefijo, longitud y dígito de control Luhn. También valida `securityCode`: 3 dígitos para Visa, Mastercard y Discover; 4 para American Express. Acepta números con espacios o guiones, pero solo persiste la marca y los últimos cuatro dígitos; nunca devuelve ni almacena el número completo ni el código de seguridad. El código solo se valida durante la creación y no se admite en `PATCH`.