import { configs } from "./node_modules/@types/triple-beam/index.d";
import dotenv from "dotenv";
import app from "./src/app";
import logger from "./src/config/logger";

dotenv.config();

const PORT = process.env.PORT || 3000;

async function startServer() {
    try {
        // Start server
        app.listen(PORT, () => {
            logger.info(`Server running on port ${PORT}`);
        });
    } catch (error) {
        logger.error("Failed to start server:", error);
        process.exit(1);
    }
}

// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
    logger.error("Unhandled Promise Rejection:", err);
    process.exit(1);
});

// Handle uncaught exceptions
process.on("uncaughtException", (err) => {
    logger.error("Uncaught Exception:", err);
    process.exit(1);
});

startServer();
