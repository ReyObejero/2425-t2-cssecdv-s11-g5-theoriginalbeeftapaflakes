"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mountRoutes = void 0;
const http_errors_1 = __importDefault(require("http-errors"));
const constants_1 = require("../constants");
const auth_router_1 = require("./auth.router");
const cart_router_1 = require("./cart.router");
const order_router_1 = require("./order.router");
const product_router_1 = require("./product.router");
const report_router_1 = require("./report.router");
const review_router_1 = require("./review.router");
const static_page_router_1 = require("./static-page.router");
const user_router_1 = require("./user.router");
const mountRoutes = (app) => {
    app.use('/auth', auth_router_1.authRouter);
    app.use('/carts', cart_router_1.cartRouter);
    app.use('/orders', order_router_1.orderRouter);
    app.use('/products', product_router_1.productRouter);
    app.use('/reports', report_router_1.reportRouter);
    app.use('/reviews', review_router_1.reviewRouter);
    app.use('/static-pages', static_page_router_1.staticPageRouter);
    app.use('/users', user_router_1.userRouter);
    app.use((req, res, next) => next((0, http_errors_1.default)(constants_1.statusCodes.clientError.NOT_FOUND, constants_1.errorMessages.RESOURCE_NOT_FOUND)));
};
exports.mountRoutes = mountRoutes;
//# sourceMappingURL=index.js.map