import "dotenv/config";
import app from "./server";
import apiRoute from "./routes";
import { errorHandler, notFound } from "./middlewares/common";

// API routes
app.use("/api/v1", apiRoute);

// Error handler
app.use(notFound).use(errorHandler);

const PORT = process.env.PORT || 8001;
app.listen(PORT, () => console.log(`API server running on http://localhost:${PORT}`));