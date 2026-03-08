
# Remote Work Compliance & Task Tracker – Backend

## Docker Usage

### Build the Docker Image

```bash
docker build -t remote-work-backend .
```

### Run the Container

```bash
docker run -p 3000:3000 --env-file .env remote-work-backend
```

### Dockerfile Notes

- Uses Node 20 Alpine and multi-stage build.
- Installs dependencies and copies all files.
- Exposes port 3000.
- Runs database migrations (scripts/migrate.js) before starting the server (src/main.js).

> **Important:**
> If you use TypeScript, you must build your project (`npm run build` or `tsc`) before running in production. Update the Dockerfile to copy and run the compiled JavaScript (e.g., `dist/server.js`).

---

## Local Development

1. Install dependencies:
	```bash
	npm install
	```
2. Create a `.env` file with your environment variables (see example below).
3. Start the development server:
	```bash
	npm run dev
	```

---

## Environment Variables Example

```env
NODE_ENV=development
PORT=3000
MONGODB_URI=mongodb://localhost:27017/nodejs-app
JWT_SECRET=your-secret-key-here
JWT_EXPIRE=7d
```

---

## Project Structure

- `src/` – Application source code (TypeScript)
- `scripts/` – Migration and seed scripts
- `server.ts` – Main server entry point

---

## Production Notes

- Ensure your build process compiles TypeScript to JavaScript before running in Docker.
- Adjust the Dockerfile CMD to match your compiled output (e.g., `node dist/server.js`).

---

## Project Structure

- `src/app.js`: Express application setup
- `src/routes/`: Route definitions
- `src/controllers/`: Request handlers
- `src/services/`: Business logic
- `src/models/`: Database models (Mongoose)
- `src/middleware/`: Custom middleware
- `src/utils/`: Utility functions
- `src/config/`: Configuration files
- `src/validators/`: Request validation

## Available Endpoints

- `GET /health`: Health check
- `POST /api/v1/auth/register`: Register new user
- `POST /api/v1/auth/login`: User login
- `GET /api/v1/users`: Get all users (authenticated)
- `GET /api/v1/users/:id`: Get user by ID (authenticated)
- `POST /api/v1/users`: Create user (authenticated)
- `PUT /api/v1/users/:id`: Update user (authenticated)
- `DELETE /api/v1/users/:id`: Delete user (authenticated)

## Available Scripts

- `npm start`: Start production server
- `npm run dev`: Start development server with nodemon
- `npm test`: Run tests
- `npm run lint`: Lint code
- `npm run format`: Format code with Prettier

## Development

- Use async/await for asynchronous operations
- Follow RESTful conventions
- Implement proper error handling
- Use middleware for cross-cutting concerns
- Validate all inputs

## Testing

```bash
npm test
```

## Production Deployment

1. Set `NODE_ENV=production` in `.env`
2. Use process manager (PM2) for running the app
3. Set up proper logging
4. Configure CORS properly
5. Use HTTPS
6. Set up monitoring and error tracking

