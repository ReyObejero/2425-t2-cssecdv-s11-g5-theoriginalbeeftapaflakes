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
exports.productService = void 0;
const http_errors_1 = __importDefault(require("http-errors"));
const constants_1 = require("../constants");
const database_1 = require("../database");
const review_service_1 = require("./review.service");
const detailedProductQueryArgs = {
    include: {
        packages: {
            include: {
                items: {
                    include: {
                        flavor: true,
                        flavorVariant: true,
                    },
                },
            },
        },
    },
};
const detailedPackageQueryArgs = {
    include: {
        items: {
            include: {
                flavor: true,
                flavorVariant: true,
            },
        },
    },
};
exports.productService = {
    deletePackage: (productId, packageId) => __awaiter(void 0, void 0, void 0, function* () {
        if (!productId) {
            throw (0, http_errors_1.default)(constants_1.statusCodes.clientError.BAD_REQUEST, constants_1.errorMessages.PRODUCT_ID_INVALID);
        }
        if (!packageId) {
            throw (0, http_errors_1.default)(constants_1.statusCodes.clientError.BAD_REQUEST, constants_1.errorMessages.PACKAGE_ID_INVALID);
        }
        const product = yield exports.productService.getProduct(productId);
        if (!product) {
            throw (0, http_errors_1.default)(constants_1.statusCodes.clientError.BAD_REQUEST, constants_1.errorMessages.PRODUCT_ID_INVALID);
        }
        const productPackage = yield exports.productService.getPackage(packageId);
        if (!productPackage) {
            throw (0, http_errors_1.default)(constants_1.statusCodes.clientError.BAD_REQUEST, constants_1.errorMessages.PACKAGE_ID_INVALID);
        }
        if (productPackage.productId != product.id) {
            throw (0, http_errors_1.default)(constants_1.statusCodes.clientError.BAD_REQUEST, constants_1.errorMessages.PRODUCT_ID_INVALID);
        }
        yield database_1.prismaClient.package.delete({ where: { id: packageId } });
        if (product.packages.length - 1 === 0) {
            yield exports.productService.deleteProduct(productId);
        }
        return productPackage;
    }),
    deletePackages: (productId) => __awaiter(void 0, void 0, void 0, function* () {
        if (!productId) {
            throw (0, http_errors_1.default)(constants_1.statusCodes.clientError.BAD_REQUEST, constants_1.errorMessages.PRODUCT_ID_INVALID);
        }
        const productPackages = yield exports.productService.getPackages(productId);
        yield exports.productService.deletePackages(productId);
        return productPackages;
    }),
    deleteProduct: (productId) => __awaiter(void 0, void 0, void 0, function* () {
        if (!productId) {
            throw (0, http_errors_1.default)(constants_1.statusCodes.clientError.BAD_REQUEST, constants_1.errorMessages.PRODUCT_ID_INVALID);
        }
        const product = yield exports.productService.getProduct(productId);
        if (!product) {
            throw (0, http_errors_1.default)(constants_1.statusCodes.clientError.BAD_REQUEST, constants_1.errorMessages.PRODUCT_ID_INVALID);
        }
        yield database_1.prismaClient.product.delete({ where: { id: productId } });
        return product;
    }),
    getPackage: (packageId) => __awaiter(void 0, void 0, void 0, function* () {
        if (!packageId) {
            throw (0, http_errors_1.default)(constants_1.statusCodes.clientError.BAD_REQUEST, constants_1.errorMessages.PACKAGE_ID_INVALID);
        }
        return yield database_1.prismaClient.package.findUnique(Object.assign({ where: { id: packageId } }, detailedPackageQueryArgs));
    }),
    getPackages: (productId) => __awaiter(void 0, void 0, void 0, function* () {
        if (!productId) {
            throw (0, http_errors_1.default)(constants_1.statusCodes.clientError.BAD_REQUEST, constants_1.errorMessages.PRODUCT_ID_INVALID);
        }
        return yield database_1.prismaClient.package.findMany(Object.assign({ where: { productId } }, detailedPackageQueryArgs));
    }),
    getProduct: (productId) => __awaiter(void 0, void 0, void 0, function* () {
        if (!productId) {
            throw (0, http_errors_1.default)(constants_1.statusCodes.clientError.BAD_REQUEST, constants_1.errorMessages.PRODUCT_ID_INVALID);
        }
        return yield database_1.prismaClient.product.findUnique(Object.assign({ where: { id: productId } }, detailedProductQueryArgs));
    }),
    getProducts: () => __awaiter(void 0, void 0, void 0, function* () {
        return yield database_1.prismaClient.product.findMany(Object.assign({}, detailedProductQueryArgs));
    }),
    updateProductAverageRating: (productId) => __awaiter(void 0, void 0, void 0, function* () {
        if (!productId || !(yield exports.productService.getProduct(productId))) {
            throw (0, http_errors_1.default)(constants_1.statusCodes.clientError.BAD_REQUEST, constants_1.errorMessages.PRODUCT_ID_INVALID);
        }
        const reviews = yield review_service_1.reviewService.getReviews();
        const sumRatings = reviews.reduce((accumulator, currentReview) => {
            return (accumulator += currentReview.rating);
        }, 0);
        return yield database_1.prismaClient.product.update(Object.assign({ where: { id: productId }, data: { averageRating: sumRatings / reviews.length } }, detailedProductQueryArgs));
    }),
};
//# sourceMappingURL=product.service.js.map