# 🎬 Movie Management System (NestJS + Fastify + TypeORM)

A modular, test-driven Movie Management API built with NestJS, Fastify, TypeORM, MySQL, layered architecture, DTO validation, and full controller / orchestrator / service separation.

Includes:

- JWT authentication
- Role-based access (`manager`, `customer`)
- Movie & screening session management
- Ticket purchase & usage workflow
- Pagination & sorting
- Soft-delete support
- Swagger API documentation
- Rich DTO validation rules
- High-coverage unit & e2e tests

## 🚀 Tech Stack

- NestJS + Fastify
- TypeORM (MySQL)
- JWT Authentication
- Class-Validator / Class-Transformer
- Swagger OpenAPI
- Jest unit + e2e tests
- Repository + Service + Orchestrator architecture

## 📂 Project Structure

```
src/
 ├─ auth/
 ├─ movie/
 ├─ movie-session/
 ├─ ticket/
 ├─ _repository/
 ├─ _service/
 ├─ _factory/
 ├─ _shared/
 ├─ _exception/
 ├─ _decorator/
 ├─ _guard/
 ├─ _util/
 └─ main.ts
```

### 🧩 Architecture Layers

| Layer | Purpose |
|------|--------|
| Controller | Handles routing, guards, DTO binding |
| Orchestrator | Business workflow coordination |
| Service | Domain logic |
| Repository | Persistence + DB access |
| Factory | Entity construction |
| DTOs | Input validation |
| Resource DTOs | Output formatting |

## 🧑‍🚀 User Roles

| Role | Permissions |
|------|------------|
| Manager | Manage movies & sessions |
| Customer | Buy & use tickets |

Authentication: `JWTGuard`  
Authorization: `ManagerGuard` / `CustomerGuard`

## 🔐 Authentication

### Register

`POST /auth/register`

Returns JWT

### Login

`POST /auth/login`

Returns JWT

## 🎥 Movies API

| Method | Endpoint | Role |
|------|---------|------|
| POST | /movies | Manager |
| PUT | /movies/:id | Manager |
| DELETE | /movies/:id | Manager |
| GET | /movies | Auth |

## 🕒 Movie Sessions API

| Method | Endpoint | Role |
|------|---------|------|
| POST | /sessions | Manager |
| PUT | /sessions/:id | Manager |
| DELETE | /sessions/:id | Manager |
| GET | /sessions | Auth |

## 🎫 Tickets API

| Method | Endpoint | Role |
|------|---------|------|
| POST | /tickets/buy | Customer |
| POST | /tickets/:id/use | Customer |
| GET | /tickets | Customer |

## 📖 Swagger Docs

http://localhost:3000/docs

## 🏗️ Local Development

```
npm install
npm run typeorm:migrate
npm run start:dev
```

## 🧪 Testing

```
npm run test
npm run test:watch
npm run test:cov
npm run test:e2e
```

## 🧩 Jest Path Mapping

```
moduleNameMapper:
  ^src/(.*)$ -> <rootDir>/src/$1
```

Clear cache if needed:

```
npx jest --clearCache
```