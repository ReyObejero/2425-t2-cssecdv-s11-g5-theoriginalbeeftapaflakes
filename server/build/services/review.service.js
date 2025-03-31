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
exports.reviewService = void 0;
const http_errors_1 = __importDefault(require("http-errors"));
const constants_1 = require("../constants");
const database_1 = require("../database");
const user_service_1 = require("./user.service");
const product_service_1 = require("./product.service");
const detailedReviewQueryArgs = {
    include: {
        user: true,
    },
};
exports.reviewService = {
    createReview: (userId, productId, rating, comment) => __awaiter(void 0, void 0, void 0, function* () {
        if (!userId || !(yield user_service_1.userService.getUserById(userId))) {
            throw (0, http_errors_1.default)(constants_1.statusCodes.clientError.BAD_REQUEST, constants_1.errorMessages.USER_ID_INVALID);
        }
        if (!productId || !(yield product_service_1.productService.getProduct(productId))) {
            throw (0, http_errors_1.default)(constants_1.statusCodes.clientError.BAD_REQUEST, constants_1.errorMessages.PRODUCT_ID_INVALID);
        }
        if (!rating) {
            if (rating != 0) {
                throw (0, http_errors_1.default)(constants_1.statusCodes.clientError.BAD_REQUEST, constants_1.errorMessages.REVIEW_RATING_INVALID);
            }
        }
        if (!comment) {
            if (comment === '') {
                throw (0, http_errors_1.default)(constants_1.statusCodes.clientError.BAD_REQUEST, constants_1.errorMessages.REVIEW_COMMENT_EMPTY);
            }
            throw (0, http_errors_1.default)(constants_1.statusCodes.clientError.BAD_REQUEST, constants_1.errorMessages.REVIEW_COMMENT_INVALID);
        }
        if (yield exports.reviewService.getReviewByProductId(userId, productId)) {
            throw (0, http_errors_1.default)(constants_1.statusCodes.clientError.BAD_REQUEST, constants_1.errorMessages.USER_REVIEW_ALREADY_EXISTS);
        }
        const review = yield database_1.prismaClient.review.create(Object.assign({ data: { userId, productId, rating, comment } }, detailedReviewQueryArgs));
        yield product_service_1.productService.updateProductAverageRating(productId);
        return review;
    }),
    getReviewById: (reviewId) => __awaiter(void 0, void 0, void 0, function* () {
        if (!reviewId) {
            throw (0, http_errors_1.default)(constants_1.statusCodes.clientError.BAD_REQUEST, constants_1.errorMessages.REVIEW_ID_INVALID);
        }
        return database_1.prismaClient.review.findFirst(Object.assign({ where: { id: reviewId } }, detailedReviewQueryArgs));
    }),
    getReviewByProductId: (userId, productId) => __awaiter(void 0, void 0, void 0, function* () {
        if (!userId || !(yield user_service_1.userService.getUserById(userId))) {
            throw (0, http_errors_1.default)(constants_1.statusCodes.clientError.BAD_REQUEST, constants_1.errorMessages.USER_ID_INVALID);
        }
        if (!productId || !(yield product_service_1.productService.getProduct(productId))) {
            throw (0, http_errors_1.default)(constants_1.statusCodes.clientError.BAD_REQUEST, constants_1.errorMessages.PRODUCT_ID_INVALID);
        }
        return database_1.prismaClient.review.findFirst(Object.assign({ where: { userId, productId } }, detailedReviewQueryArgs));
    }),
    getReviews: () => __awaiter(void 0, void 0, void 0, function* () {
        return yield database_1.prismaClient.review.findMany(Object.assign({}, detailedReviewQueryArgs));
    }),
    updateReview: (reviewId, rating, comment) => __awaiter(void 0, void 0, void 0, function* () {
        if (!reviewId) {
            throw (0, http_errors_1.default)(constants_1.statusCodes.clientError.BAD_REQUEST, constants_1.errorMessages.USER_ID_INVALID);
        }
        if (!rating) {
            if (rating != 0) {
                throw (0, http_errors_1.default)(constants_1.statusCodes.clientError.BAD_REQUEST, constants_1.errorMessages.REVIEW_RATING_INVALID);
            }
        }
        if (!comment) {
            if (comment === '') {
                throw (0, http_errors_1.default)(constants_1.statusCodes.clientError.BAD_REQUEST, constants_1.errorMessages.REVIEW_COMMENT_EMPTY);
            }
            throw (0, http_errors_1.default)(constants_1.statusCodes.clientError.BAD_REQUEST, constants_1.errorMessages.REVIEW_COMMENT_INVALID);
        }
        const existingReview = yield exports.reviewService.getReviewById(reviewId);
        if (!existingReview) {
            throw (0, http_errors_1.default)(constants_1.statusCodes.clientError.BAD_REQUEST, constants_1.errorMessages.REVIEW_ID_INVALID);
        }
        const review = yield database_1.prismaClient.review.update(Object.assign({ where: { id: reviewId }, data: { rating, comment } }, detailedReviewQueryArgs));
        yield product_service_1.productService.updateProductAverageRating(review.productId);
        return review;
    }),
    deleteReview: (userId, reviewId) => __awaiter(void 0, void 0, void 0, function* () {
        if (!userId || !(yield user_service_1.userService.getUserById(userId))) {
            throw (0, http_errors_1.default)(constants_1.statusCodes.clientError.BAD_REQUEST, constants_1.errorMessages.USER_ID_INVALID);
        }
        if (!reviewId) {
            throw (0, http_errors_1.default)(constants_1.statusCodes.clientError.BAD_REQUEST, constants_1.errorMessages.REVIEW_ID_INVALID);
        }
        const review = yield exports.reviewService.getReviewById(reviewId);
        if (!review) {
            throw (0, http_errors_1.default)(constants_1.statusCodes.clientError.BAD_REQUEST, constants_1.errorMessages.REVIEW_ID_INVALID);
        }
        if (review.userId != userId) {
            throw (0, http_errors_1.default)(constants_1.statusCodes.clientError.BAD_REQUEST, constants_1.errorMessages.USER_DELETE_REVIEW_DENIED);
        }
        yield database_1.prismaClient.review.delete({ where: { id: reviewId } });
        yield product_service_1.productService.updateProductAverageRating(review.productId);
        return review;
    }),
};
//# sourceMappingURL=review.service.js.map