import express, { Application, Request, Response, NextFunction } from "express";
import cors from "cors";

const app: Application = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check route
app.get("/", (req: Request, res: Response) => {
    res.json({
        success: true,
        message: "API is running",
    });
});

// Example route
app.get("/api/test", (req: Request, res: Response) => {
    res.json({
        message: "Test route working",
    });
});

// Global error handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err);

    res.status(500).json({
        success: false,
        message: "Internal Server Error",
    });
});

export default app;
