# 💳 Wallet Microservices

<p align="center">
  <img src="https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white" />
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" />
  <img src="https://img.shields.io/badge/NATS-27AAE1?style=for-the-badge&logo=natsdotio&logoColor=white" />
  <img src="https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white" />
  <img src="https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white" />
</p>

Billetera digital simulada construida con arquitectura de **microservicios**. Cada servicio tiene su propia base de datos y se comunica de forma asíncrona a través de **NATS**.

---

## 🏗️ Arquitectura

```mermaid
graph TD
    Client(["🌐 Cliente HTTP"])

    subgraph Gateway["API Gateway :3000"]
        GW[/"api/v1"/]
    end

    subgraph Broker["Message Broker"]
        NATS["📨 NATS"]
    end

    subgraph Services["Microservicios"]
        AUTH["🔐 auth-service"]
        ACC["🏦 accounts-service"]
        TXN["💸 transactions-service"]
        NOTIF["🔔 notifications-service"]
    end

    subgraph Databases["Bases de datos (PostgreSQL)"]
        DB_AUTH[("auth_db")]
        DB_ACC[("accounts_db")]
        DB_TXN[("transactions_db")]
    end

    Client -->|REST| GW
    GW -->|NATS publish/subscribe| NATS
    NATS --> AUTH
    NATS --> ACC
    NATS --> TXN
    NATS --> NOTIF

    AUTH --- DB_AUTH
    ACC --- DB_ACC
    TXN --- DB_TXN
```

---

## 🔄 Flujo de transferencia

```mermaid
sequenceDiagram
    actor User
    participant GW as API Gateway
    participant NATS
    participant TXN as transactions-service
    participant ACC as accounts-service
    participant NOTIF as notifications-service

    User->>GW: POST /transactions/transfer
    GW->>NATS: transaction.transfer
    NATS->>TXN: procesar transferencia
    TXN->>TXN: crea TX → status: PENDING
    TXN->>NATS: account.updateBalance (débito)
    NATS->>ACC: descuenta saldo al emisor
    TXN->>NATS: account.updateBalance (crédito)
    NATS->>ACC: acredita saldo al receptor
    TXN->>TXN: TX → status: COMPLETED
    TXN-->>NATS: transaction.completed (evento)
    NATS-->>NOTIF: envía notificación
    TXN-->>GW: respuesta
    GW-->>User: 201 Created
```

---

## 📦 Servicios

| Servicio | Responsabilidad | Puerto interno | DB |
|---|---|---|---|
| `api-gateway` | Punto de entrada HTTP, validación JWT | `3000` | — |
| `auth-service` | Registro, login, generación de JWT | NATS | `auth_db` |
| `accounts-service` | Cuentas y saldos | NATS | `accounts_db` |
| `transactions-service` | Transferencias e historial | NATS | `transactions_db` |
| `notifications-service` | Notificaciones de eventos | NATS | — |

---

## 🚀 Levantar el proyecto

### Requisitos
- [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- Node.js 20+

### Con Docker (recomendado)

```bash
docker compose up --build -d
```

Todos los servicios, bases de datos y el broker levantan automáticamente.

### Desarrollo local

```bash
npm install
# Levantar solo la infraestructura
docker compose up nats postgres-auth postgres-accounts postgres-transactions -d
# Correr un servicio en watch mode
npm run start:dev auth-service
```

---

## 📡 API Endpoints

Base URL: `http://localhost:3000/api/v1`

### Auth
| Método | Endpoint | Auth | Descripción |
|---|---|---|---|
| `POST` | `/auth/register` | ❌ | Registrar usuario |
| `POST` | `/auth/login` | ❌ | Login, retorna JWT |

### Accounts
| Método | Endpoint | Auth | Descripción |
|---|---|---|---|
| `POST` | `/accounts` | ✅ | Crear cuenta |
| `GET` | `/accounts/balance` | ✅ | Ver saldo |

### Transactions
| Método | Endpoint | Auth | Descripción |
|---|---|---|---|
| `POST` | `/transactions/transfer` | ✅ | Transferir fondos |
| `GET` | `/transactions/history` | ✅ | Historial de movimientos |
| `GET` | `/transactions/:id` | ✅ | Detalle de transacción |

---

## 🧱 Principios aplicados

- **SOLID**: cada servicio tiene una única responsabilidad y depende de abstracciones (NATS), no de implementaciones concretas.
- **Database per Service**: cada microservicio tiene su propia base de datos aislada.
- **API Gateway pattern**: único punto de entrada que centraliza autenticación y enrutamiento.
- **Event-driven**: las notificaciones se disparan mediante eventos asíncronos, sin acoplamiento directo.

---

## 🛠️ Stack

- **Framework**: NestJS (monorepo)
- **Lenguaje**: TypeScript
- **Mensajería**: NATS
- **ORM**: TypeORM
- **Base de datos**: PostgreSQL
- **Contenedores**: Docker Compose
- **Auth**: JWT (jsonwebtoken)
