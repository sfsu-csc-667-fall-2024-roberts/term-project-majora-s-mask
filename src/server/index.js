"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const http_errors_1 = __importDefault(require("http-errors"));
const morgan_1 = __importDefault(require("morgan"));
const path = __importStar(require("path"));
const auth_1 = __importDefault(require("./routes/auth"));
// Milestone 3 Libraries
const connect_livereload_1 = __importDefault(require("connect-livereload"));
const livereload_1 = __importDefault(require("livereload"));
const root_1 = __importDefault(require("./routes/root"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
// Middleware
app.use((0, morgan_1.default)("dev"));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
app.use((0, cookie_parser_1.default)());
// Static directory
const staticPath = path.join(process.cwd(), "src", "public");
app.use(express_1.default.static(staticPath));
// View engine setup
app.set("views", path.join(process.cwd(), "src", "server", "views"));
app.set("view engine", "ejs");
// Routes
app.use("/", root_1.default);
app.use("/auth", auth_1.default);
// 404 Error Handler
app.use((_request, _response, next) => {
    next((0, http_errors_1.default)(404));
});
// Livereload for development
if (process.env.NODE_ENV === "development") {
    const reloadServer = livereload_1.default.createServer();
    reloadServer.watch(staticPath);
    reloadServer.server.once("connection", () => {
        setTimeout(() => {
            reloadServer.refresh("/");
        }, 100);
    });
    app.use((0, connect_livereload_1.default)());
}
// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
