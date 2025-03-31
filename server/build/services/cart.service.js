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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cartService = void 0;
const http_errors_1 = __importDefault(require("http-errors"));
const constants_1 = require("../constants");
const database_1 = require("../database");
const product_service_1 = require("./product.service");
const user_service_1 = require("./user.service");
const detailedCartQueryArgs = {
    include: {
        items: {
            include: {
                product: true,
                package: true,
            },
        },
    },
};
const detailedCartItemQueryArgs = {
    include: {
        product: true,
        package: true,
    },
};
exports.cartService = {
    createCart: (userId) => __awaiter(void 0, void 0, void 0, function* () {
        if (!userId) {
            throw (0, http_errors_1.default)(constants_1.statusCodes.clientError.BAD_REQUEST, constants_1.errorMessages.USER_ID_INVALID);
        }
        const user = yield user_service_1.userService.getUserById(userId);
        if (!user) {
            throw (0, http_errors_1.default)(constants_1.statusCodes.clientError.BAD_REQUEST, constants_1.errorMessages.USER_ID_INVALID);
        }
        const existingCart = yield exports.cartService.getCartByUserId(userId);
        if (existingCart) {
            throw (0, http_errors_1.default)(constants_1.statusCodes.clientError.CONFLICT, constants_1.errorMessages.CART_ALREADY_EXISTS);
        }
        return yield database_1.prismaClient.cart.create(Object.assign({ data: {
                userId,
            } }, detailedCartQueryArgs));
    }),
    createCartItem: (userId_1, productId_1, packageId_1, ...args_1) => __awaiter(void 0, [userId_1, productId_1, packageId_1, ...args_1], void 0, function* (userId, productId, packageId, quantity = 1) {
        if (!userId) {
            throw (0, http_errors_1.default)(constants_1.statusCodes.clientError.BAD_REQUEST, constants_1.errorMessages.USER_ID_INVALID);
        }
        if (!productId) {
            throw (0, http_errors_1.default)(constants_1.statusCodes.clientError.BAD_REQUEST, constants_1.errorMessages.PRODUCT_ID_INVALID);
        }
        if (!packageId) {
            throw (0, http_errors_1.default)(constants_1.statusCodes.clientError.BAD_REQUEST, constants_1.errorMessages.PACKAGE_ID_INVALID);
        }
        if (!quantity) {
            throw (0, http_errors_1.default)(constants_1.statusCodes.clientError.BAD_REQUEST, constants_1.errorMessages.QUANTITY_INVALID);
        }
        if (!(yield user_service_1.userService.getUserById(userId))) {
            throw (0, http_errors_1.default)(constants_1.statusCodes.clientError.BAD_REQUEST, constants_1.errorMessages.USER_ID_INVALID);
        }
        if (!(yield product_service_1.productService.getProduct(productId))) {
            throw (0, http_errors_1.default)(constants_1.statusCodes.clientError.BAD_REQUEST, constants_1.errorMessages.PRODUCT_ID_INVALID);
        }
        const productPackage = yield product_service_1.productService.getPackage(packageId);
        if (!productPackage) {
            throw (0, http_errors_1.default)(constants_1.statusCodes.clientError.BAD_REQUEST, constants_1.errorMessages.PACKAGE_ID_INVALID);
        }
        let cart = yield exports.cartService.getCartByUserId(userId);
        if (!cart) {
            cart = yield exports.cartService.createCart(userId);
        }
        let existingCartItem = yield exports.cartService.getCartItemByPackage(cart.id, productId, packageId);
        if (!existingCartItem) {
            const cartItem = yield database_1.prismaClient.cartItem.create(Object.assign({ data: {
                    cartId: cart === null || cart === void 0 ? void 0 : cart.id,
                    productId,
                    packageId,
                    quantity,
                    price: (productPackage === null || productPackage === void 0 ? void 0 : productPackage.price) * quantity,
                } }, detailedCartItemQueryArgs));
            yield exports.cartService.updateCartTotalPrice(cart.id);
            return cartItem;
        }
        else {
            existingCartItem = yield exports.cartService.updateCartItem(existingCartItem.id, existingCartItem.quantity + quantity);
            return existingCartItem;
        }
    }),
    getCartById: (cartId) => __awaiter(void 0, void 0, void 0, function* () {
        if (!cartId) {
            throw (0, http_errors_1.default)(constants_1.statusCodes.clientError.BAD_REQUEST, constants_1.errorMessages.CART_ID_INVALID);
        }
        return yield database_1.prismaClient.cart.findUnique(Object.assign({ where: {
                id: cartId,
            } }, detailedCartQueryArgs));
    }),
    getCartByUserId: (userId) => __awaiter(void 0, void 0, void 0, function* () {
        if (!userId) {
            throw (0, http_errors_1.default)(constants_1.statusCodes.clientError.BAD_REQUEST, constants_1.errorMessages.USER_ID_INVALID);
        }
        return yield database_1.prismaClient.cart.findUnique(Object.assign({ where: {
                userId,
            } }, detailedCartQueryArgs));
    }),
    getCartItemById: (cartItemId) => __awaiter(void 0, void 0, void 0, function* () {
        if (!cartItemId) {
            throw (0, http_errors_1.default)(constants_1.statusCodes.clientError.BAD_REQUEST, constants_1.errorMessages.CART_ITEM_ID_INVALID);
        }
        return yield database_1.prismaClient.cartItem.findUnique(Object.assign({ where: {
                id: cartItemId,
            } }, detailedCartItemQueryArgs));
    }),
    getCartItemByPackage: (cartId, productId, packageId) => __awaiter(void 0, void 0, void 0, function* () {
        if (!cartId) {
            throw (0, http_errors_1.default)(constants_1.statusCodes.clientError.BAD_REQUEST, constants_1.errorMessages.CART_ID_INVALID);
        }
        if (!productId) {
            throw (0, http_errors_1.default)(constants_1.statusCodes.clientError.BAD_REQUEST, constants_1.errorMessages.PRODUCT_ID_INVALID);
        }
        if (!packageId) {
            throw (0, http_errors_1.default)(constants_1.statusCodes.clientError.BAD_REQUEST, constants_1.errorMessages.PACKAGE_ID_INVALID);
        }
        return yield database_1.prismaClient.cartItem.findFirst(Object.assign({ where: {
                cartId,
                productId,
                packageId,
            } }, detailedCartItemQueryArgs));
    }),
    getCartItemsByCartId: (cartId) => __awaiter(void 0, void 0, void 0, function* () {
        if (!cartId) {
            throw (0, http_errors_1.default)(constants_1.statusCodes.clientError.BAD_REQUEST, constants_1.errorMessages.CART_ID_INVALID);
        }
        return yield database_1.prismaClient.cartItem.findMany(Object.assign({ where: { cartId } }, detailedCartItemQueryArgs));
    }),
    getCarts: () => __awaiter(void 0, void 0, void 0, function* () {
        return yield database_1.prismaClient.cart.findMany(detailedCartQueryArgs);
    }),
    updateCartTotalPrice: (cartId) => __awaiter(void 0, void 0, void 0, function* () {
        if (!cartId) {
            throw (0, http_errors_1.default)(constants_1.statusCodes.clientError.BAD_REQUEST, constants_1.errorMessages.CART_ID_INVALID);
        }
        const cart = yield exports.cartService.getCartById(cartId);
        if (!cart) {
            throw (0, http_errors_1.default)(constants_1.statusCodes.clientError.BAD_REQUEST, constants_1.errorMessages.CART_ID_INVALID);
        }
        const cartItems = yield exports.cartService.getCartItemsByCartId(cartId);
        const newTotalPrice = cartItems.reduce((accumulator, currentCartItem) => accumulator + currentCartItem.price, 0);
        return yield database_1.prismaClient.cart.update(Object.assign({ where: { id: cartId }, data: { totalPrice: newTotalPrice } }, detailedCartQueryArgs));
    }),
    updateCartItem: (cartItemId, quantity) => __awaiter(void 0, void 0, void 0, function* () {
        if (!cartItemId) {
            throw (0, http_errors_1.default)(constants_1.statusCodes.clientError.BAD_REQUEST, constants_1.errorMessages.CART_ITEM_ID_INVALID);
        }
        if (!quantity) {
            throw (0, http_errors_1.default)(constants_1.statusCodes.clientError.BAD_REQUEST, constants_1.errorMessages.QUANTITY_INVALID);
        }
        let cartItem = yield exports.cartService.getCartItemById(cartItemId);
        if (!cartItem) {
            throw (0, http_errors_1.default)(constants_1.statusCodes.clientError.BAD_REQUEST, constants_1.errorMessages.CART_ITEM_ID_INVALID);
        }
        cartItem = yield database_1.prismaClient.cartItem.update(Object.assign({ where: { id: cartItemId }, data: {
                quantity,
            } }, detailedCartItemQueryArgs));
        yield exports.cartService.updateCartTotalPrice(cartItem.cartId);
        return cartItem;
    }),
    deleteCartItem: (cartItemId) => __awaiter(void 0, void 0, void 0, function* () {
        if (!cartItemId) {
            throw (0, http_errors_1.default)(constants_1.statusCodes.clientError.BAD_REQUEST, constants_1.errorMessages.CART_ITEM_ID_INVALID);
        }
        const cartItem = yield exports.cartService.getCartItemById(cartItemId);
        if (!cartItem) {
            throw (0, http_errors_1.default)(constants_1.statusCodes.clientError.BAD_REQUEST, constants_1.errorMessages.CART_ITEM_ID_INVALID);
        }
        yield database_1.prismaClient.cartItem.delete({ where: { id: cartItem.id } });
        return cartItem;
    }),
    deleteCarts: () => __awaiter(void 0, void 0, void 0, function* () {
        const carts = yield exports.cartService.getCarts();
        yield database_1.prismaClient.cart.deleteMany();
        return carts;
    }),
};
//# sourceMappingURL=cart.service.js.map