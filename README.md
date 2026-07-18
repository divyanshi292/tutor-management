# Tutor Management

A React frontend and Express/MongoDB backend for managing students,
attendance, tutor profile details, and authentication.

## Project structure

- `frontend/` — React and Vite application
- `backend/` — Express API and MongoDB models

## Setup

Install each application's dependencies:

```powershell
npm --prefix frontend install
npm --prefix backend install
```

Copy `backend/.env.example` to `backend/.env` and provide the database and
JWT values. Optionally copy `frontend/.env.example` to `frontend/.env` when
the API is hosted somewhere other than the default local address.

## Development

Run the backend:

```powershell
npm run backend
```

Run the frontend in another terminal:

```powershell
npm run frontend
```

The frontend uses Vite's default development address. The backend currently
listens on port `5000`.

## Checks

```powershell
npm run lint
npm run build
```
