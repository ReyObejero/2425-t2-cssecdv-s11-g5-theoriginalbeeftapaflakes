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
exports.orderService = void 0;
const client_1 = require("@prisma/client");
const http_errors_1 = __importDefault(require("http-errors"));
const config_1 = require("../config");
const constants_1 = require("../constants");
const database_1 = require("../database");
const utils_1 = require("../utils");
const product_service_1 = require("./product.service");
const user_service_1 = require("./user.service");
const detailedOrderQueryArgs = {
    include: {
        user: true,
        product: true,
        package: true,
    },
};
exports.orderService = {
    createOrder: (userId, productId, packageId, quantity, price, creditCard) => __awaiter(void 0, void 0, void 0, function* () {
        if (!userId) {
            throw (0, http_errors_1.default)(constants_1.statusCodes.clientError.BAD_REQUEST, constants_1.errorMessages.USER_ID_INVALID);
        }
        const user = yield user_service_1.userService.getUserById(userId);
        if (!user) {
            throw (0, http_errors_1.default)(constants_1.statusCodes.clientError.BAD_REQUEST, constants_1.errorMessages.USER_ID_INVALID);
        }
        if (!user.address) {
            throw (0, http_errors_1.default)(constants_1.statusCodes.clientError.BAD_REQUEST, constants_1.errorMessages.USER_ADDRESS_INVALID);
        }
        if (!productId || !(yield product_service_1.productService.getProduct(productId))) {
            throw (0, http_errors_1.default)(constants_1.statusCodes.clientError.BAD_REQUEST, constants_1.errorMessages.PRODUCT_ID_INVALID);
        }
        if (!packageId || !(yield product_service_1.productService.getPackage(packageId))) {
            throw (0, http_errors_1.default)(constants_1.statusCodes.clientError.BAD_REQUEST, constants_1.errorMessages.PACKAGE_ID_INVALID);
        }
        if (!quantity) {
            throw (0, http_errors_1.default)(constants_1.statusCodes.clientError.BAD_REQUEST, constants_1.errorMessages.ORDER_ID_INVALID);
        }
        if (!price) {
            throw (0, http_errors_1.default)(constants_1.statusCodes.clientError.BAD_REQUEST, constants_1.errorMessages.PRICE_INVALID);
        }
        const order = yield database_1.prismaClient.order.create(Object.assign({ data: { userId, productId, packageId, quantity, price } }, detailedOrderQueryArgs));
        const response = yield fetch(`${config_1.env.paypal.SANDBOX_BASE_URL}/v2/checkout/orders`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'PayPal-Request-Id': order.id.toString(),
                Authorization: `Bearer ${yield (0, utils_1.generatePayPalAccessToken)()}`,
            },
            body: JSON.stringify({
                intent: 'CAPTURE',
                purchase_units: [
                    {
                        amount: {
                            currency_code: 'PHP',
                            value: price.toString(),
                        },
                    },
                ],
                payment_source: {
                    card: creditCard,
                },
            }),
        });
        const data = yield response.json();
        if (response.status !== 200 && response.status !== 201) {
            yield exports.orderService.deleteOrder(order.id);
            throw (0, http_errors_1.default)(constants_1.statusCodes.clientError.BAD_REQUEST, constants_1.errorMessages.PAYMENT_FAILED);
        }
        yield exports.orderService.updateOrderStatus(userId, order.id, 'CONFIRMED', new Date());
        return yield exports.orderService.updatePayPalOrderId(order.id, data.id);
    }),
    getOrder: (orderId) => __awaiter(void 0, void 0, void 0, function* () {
        if (!orderId) {
            throw (0, http_errors_1.default)(constants_1.statusCodes.clientError.BAD_REQUEST, constants_1.errorMessages.ORDER_ID_INVALID);
        }
        return database_1.prismaClient.order.findUnique(Object.assign({ where: { id: orderId } }, detailedOrderQueryArgs));
    }),
    getOrders: () => __awaiter(void 0, void 0, void 0, function* () {
        return yield database_1.prismaClient.order.findMany(detailedOrderQueryArgs);
    }),
    getOrdersByUserId: (userId) => __awaiter(void 0, void 0, void 0, function* () {
        if (!userId || !(yield user_service_1.userService.getUserById(userId))) {
            throw (0, http_errors_1.default)(constants_1.statusCodes.clientError.BAD_REQUEST, constants_1.errorMessages.USER_ID_INVALID);
        }
        return yield database_1.prismaClient.order.findMany(Object.assign({ where: { userId } }, detailedOrderQueryArgs));
    }),
    updateOrderStatus: (userId, orderId, updatedStatus, updatedDate) => __awaiter(void 0, void 0, void 0, function* () {
        if (!userId) {
            throw (0, http_errors_1.default)(constants_1.statusCodes.clientError.BAD_REQUEST, constants_1.errorMessages.USER_ID_INVALID);
        }
        const user = yield user_service_1.userService.getUserById(userId);
        if (!user) {
            throw (0, http_errors_1.default)(constants_1.statusCodes.clientError.BAD_REQUEST, constants_1.errorMessages.USER_ID_INVALID);
        }
        if (!orderId || !(yield exports.orderService.getOrder(orderId))) {
            throw (0, http_errors_1.default)(constants_1.statusCodes.clientError.BAD_REQUEST, constants_1.errorMessages.ORDER_ID_INVALID);
        }
        if (!updatedStatus || !Object.values(client_1.OrderStatus).includes(updatedStatus) || updatedStatus === 'PROCESSING') {
            throw (0, http_errors_1.default)(constants_1.statusCodes.clientError.BAD_REQUEST, constants_1.errorMessages.ORDER_STATUS_INVALID);
        }
        if (!updatedDate) {
            throw (0, http_errors_1.default)(constants_1.statusCodes.clientError.BAD_REQUEST, constants_1.errorMessages.DATE_INVALID);
        }
        if (user.role !== 'ADMIN' && updatedStatus !== 'DELIVERED' && updatedStatus !== 'CANCELLED') {
            throw (0, http_errors_1.default)(constants_1.statusCodes.clientError.BAD_REQUEST, constants_1.errorMessages.ORDER_STATUS_UPDATE_DENIED);
        }
        const statusDateFields = {
            CONFIRMED: 'confirmedAt',
            PACKED: 'packedAt',
            SHIPPED: 'shippedAt',
            OUT_FOR_DELIVERY: 'outForDeliveryAt',
            DELIVERED: 'deliveredAt',
            CANCELLED: 'cancelledAt',
        };
        const dateField = statusDateFields[updatedStatus];
        return yield database_1.prismaClient.order.update(Object.assign({ where: { id: orderId }, data: { status: updatedStatus, [dateField]: updatedDate } }, detailedOrderQueryArgs));
    }),
    updatePayPalOrderId: (orderId, payPalOrderId) => __awaiter(void 0, void 0, void 0, function* () {
        if (!orderId || !(yield exports.orderService.getOrder(orderId))) {
            throw (0, http_errors_1.default)(constants_1.statusCodes.clientError.BAD_REQUEST, constants_1.errorMessages.ORDER_ID_INVALID);
        }
        if (!payPalOrderId) {
            throw (0, http_errors_1.default)(constants_1.statusCodes.clientError.BAD_REQUEST, constants_1.errorMessages.ORDER_ID_INVALID);
        }
        return yield database_1.prismaClient.order.update(Object.assign({ where: { id: orderId }, data: { payPalOrderId } }, detailedOrderQueryArgs));
    }),
    deleteOrder: (orderId) => __awaiter(void 0, void 0, void 0, function* () {
        if (!orderId) {
            throw (0, http_errors_1.default)(constants_1.statusCodes.clientError.BAD_REQUEST, constants_1.errorMessages.ORDER_ID_INVALID);
        }
        const order = yield exports.orderService.getOrder(orderId);
        if (!order) {
            throw (0, http_errors_1.default)(constants_1.statusCodes.clientError.BAD_REQUEST, constants_1.errorMessages.ORDER_ID_INVALID);
        }
        return yield database_1.prismaClient.order.delete(Object.assign({ where: { id: orderId } }, detailedOrderQueryArgs));
    }),
};
//# sourceMappingURL=order.service.js.map