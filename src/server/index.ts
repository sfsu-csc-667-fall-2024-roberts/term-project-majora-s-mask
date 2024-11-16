import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import express from "express";
import httpErrors from "http-errors";
import morgan from "morgan";
import * as path from "path";

// Milestone 3 Libraries
import connectLiveReload from "connect-livereload";
import livereload from "livereload";

import rootRoutes from "./routes/root";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Static directory
const staticPath = path.join(process.cwd(), "src", "public");
app.use(express.static(staticPath));

// View engine setup
app.set("views", path.join(process.cwd(), "src", "server", "views"));
app.set("view engine", "ejs");

// Routes
app.use("/", rootRoutes);

// 404 Error Handler
app.use((_request, _response, next) => {
  next(httpErrors(404));
});

// Livereload for development
if (process.env.NODE_ENV === "development") {
  const reloadServer = livereload.createServer();
  reloadServer.watch(staticPath);
  reloadServer.server.once("connection", () => {
    setTimeout(() => {
      reloadServer.refresh("/");
    }, 100);
  });
  app.use(connectLiveReload());
}

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
