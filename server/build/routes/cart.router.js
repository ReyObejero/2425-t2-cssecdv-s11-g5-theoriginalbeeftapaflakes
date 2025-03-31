"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cartRouter = void 0;
const express_1 = require("express");
const controllers_1 = require("../controllers");
const middlewares_1 = require("../middlewares");
const validations_1 = require("../validations");
const cartRouter = (0, express_1.Router)();
exports.cartRouter = cartRouter;
cartRouter.post('/items', middlewares_1.authenticate, (0, middlewares_1.validate)(validations_1.createCartItemSchema), controllers_1.cartController.createCartItem);
cartRouter.get('/', controllers_1.cartController.getCarts);
cartRouter.get('/me', middlewares_1.authenticate, controllers_1.cartController.getAuthenticatedUserCart);
cartRouter.put('/items/:cartItemId', middlewares_1.authenticate, (0, middlewares_1.validate)(validations_1.updateCartItemSchema), controllers_1.cartController.updateCartItem);
cartRouter.delete('/', middlewares_1.authenticate, middlewares_1.protect, controllers_1.cartController.deleteCarts);
cartRouter.delete('/items/:cartItemId', middlewares_1.authenticate, (0, middlewares_1.validate)(validations_1.deleteCartItemSchema), controllers_1.cartController.deleteCartItem);
//# sourceMappingURL=cart.router.js.map