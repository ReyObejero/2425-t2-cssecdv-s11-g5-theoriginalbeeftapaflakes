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
exports.productController = void 0;
const constants_1 = require("../constants");
const utils_1 = require("../utils");
const services_1 = require("../services");
exports.productController = {
    getProduct: (0, utils_1.asyncRequestHandlerWrapper)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const product = yield services_1.productService.getProduct(Number(req.params.productId));
        return (0, utils_1.sendResponse)(res, constants_1.statusCodes.successful.OK, { data: product });
    })),
    getProducts: (0, utils_1.asyncRequestHandlerWrapper)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const products = yield services_1.productService.getProducts();
        return (0, utils_1.sendResponse)(res, constants_1.statusCodes.successful.OK, { data: { items: products } });
    })),
    deletePackage: (0, utils_1.asyncRequestHandlerWrapper)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { productId, packageId } = req.params;
        const productPackage = yield services_1.productService.deletePackage(Number(productId), Number(packageId));
        return (0, utils_1.sendResponse)(res, constants_1.statusCodes.successful.OK, { data: productPackage });
    })),
};
//# sourceMappingURL=product.controller.js.map