import "dotenv/config";
import app from "./server";
import apiRoute from "./routes";
import { errorHandler, notFound } from "./middlewares/common";

// API routes
app.use("/api/v1", apiRoute);

// Error handler
app.use(notFound).use(errorHandler);

export default app;
