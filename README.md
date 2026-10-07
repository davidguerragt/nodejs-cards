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
  "brand": "Visa",
  "expirationMonth": 12,
  "expirationYear": 2030
}
```

La respuesta del alta incluye un número sintético de prueba generado para la marca elegida. Si se cambia la marca con `PATCH`, se genera otro número y se devuelve en esa respuesta.

## Estructura

- `domain`: entidad y puerto del repositorio
- `application`: casos de uso del CRUD
- `infrastructure`: cliente Prisma y adaptador MySQL
- `interfaces/http`: rutas, controladores, esquemas de validación y errores

La API genera números sintéticos con prefijos y longitudes correspondientes a Visa, Mastercard, American Express y Discover, además de un dígito de control Luhn. Solo devuelve el número completo en la respuesta de creación o al cambiar la marca; MySQL almacena únicamente la marca y los últimos cuatro dígitos. Estos números son para pruebas locales, no para procesar pagos. Nunca se recibe ni se almacena un CVV.