"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const config_1 = require("./config");
const middlewares_1 = require("./middlewares");
const routes_1 = require("./routes");
const app = (0, express_1.default)();
exports.app = app;
app.use((0, cors_1.default)({
    origin: config_1.env.cors.CORS_ORIGIN,
    credentials: true,
}));
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.json());
(0, routes_1.mountRoutes)(app);
app.use(middlewares_1.errorHandler);
//# sourceMappingURL=app.js.map