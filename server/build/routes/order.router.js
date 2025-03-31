"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderRouter = void 0;
const express_1 = require("express");
const controllers_1 = require("../controllers");
const middlewares_1 = require("../middlewares");
const validations_1 = require("../validations");
const orderRouter = (0, express_1.Router)();
exports.orderRouter = orderRouter;
orderRouter.post('/', middlewares_1.authenticate, (0, middlewares_1.validate)(validations_1.createOrderSchema), controllers_1.orderController.createOrder);
orderRouter.get('/', middlewares_1.authenticate, middlewares_1.protect, controllers_1.orderController.getOrders);
orderRouter.get('/me', middlewares_1.authenticate, controllers_1.orderController.getAuthenticatedUserOrders);
orderRouter.put('/:orderId', middlewares_1.authenticate, (0, middlewares_1.validate)(validations_1.updateOrderStatusSchema), controllers_1.orderController.updateOrderStatus);
//# sourceMappingURL=order.router.js.map