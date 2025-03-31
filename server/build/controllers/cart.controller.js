"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cartController = void 0;
const constants_1 = require("../constants");
const services_1 = require("../services");
const utils_1 = require("../utils");
exports.cartController = {
    createCartItem: (0, utils_1.asyncRequestHandlerWrapper)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { productId, packageId } = req.body;
        const cartItem = yield services_1.cartService.createCartItem(req.jwtPayload.userId, productId, packageId, req.body.quantity);
        return (0, utils_1.sendResponse)(res, constants_1.statusCodes.successful.OK, { data: cartItem });
    })),
    getAuthenticatedUserCart: (0, utils_1.asyncRequestHandlerWrapper)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const cart = yield services_1.cartService.getCartByUserId(req.jwtPayload.userId);
        return (0, utils_1.sendResponse)(res, constants_1.statusCodes.successful.OK, { data: cart });
    })),
    getCarts: (0, utils_1.asyncRequestHandlerWrapper)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const carts = yield services_1.cartService.getCarts();
        return (0, utils_1.sendResponse)(res, constants_1.statusCodes.successful.OK, { data: { items: carts } });
    })),
    updateCartItem: (0, utils_1.asyncRequestHandlerWrapper)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const cart = yield services_1.cartService.updateCartItem(Number(req.params.cartItemId), req.body.quantity);
        return (0, utils_1.sendResponse)(res, constants_1.statusCodes.successful.OK, { data: { cart } });
    })),
    deleteCartItem: (0, utils_1.asyncRequestHandlerWrapper)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const cartItem = yield services_1.cartService.deleteCartItem(Number(req.params.cartItemId));
        return (0, utils_1.sendResponse)(res, constants_1.statusCodes.successful.OK, { data: cartItem });
    })),
    deleteCarts: (0, utils_1.asyncRequestHandlerWrapper)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const carts = yield services_1.cartService.deleteCarts();
        return (0, utils_1.sendResponse)(res, constants_1.statusCodes.successful.OK, { data: { items: carts } });
    })),
};
//# sourceMappingURL=cart.controller.js.map