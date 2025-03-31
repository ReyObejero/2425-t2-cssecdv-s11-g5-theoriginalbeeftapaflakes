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
exports.reviewController = void 0;
const constants_1 = require("../constants");
const services_1 = require("../services");
const utils_1 = require("../utils");
exports.reviewController = {
    createReview: (0, utils_1.asyncRequestHandlerWrapper)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const review = yield services_1.reviewService.createReview(req.jwtPayload.userId, Number(req.params.productId), req.body.rating, req.body.comment);
        return (0, utils_1.sendResponse)(res, constants_1.statusCodes.successful.CREATED, { data: review });
    })),
    getReviews: (0, utils_1.asyncRequestHandlerWrapper)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const reviews = yield services_1.reviewService.getReviews();
        return (0, utils_1.sendResponse)(res, constants_1.statusCodes.successful.CREATED, { data: { items: reviews } });
    })),
    updateReview: (0, utils_1.asyncRequestHandlerWrapper)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const review = yield services_1.reviewService.updateReview(Number(req.params.reviewId), req.body.rating, req.body.comment);
        return (0, utils_1.sendResponse)(res, constants_1.statusCodes.successful.OK, { data: review });
    })),
    deleteReview: (0, utils_1.asyncRequestHandlerWrapper)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const review = yield services_1.reviewService.deleteReview(req.jwtPayload.userId, Number(req.params.reviewId));
        return (0, utils_1.sendResponse)(res, constants_1.statusCodes.successful.OK, { data: review });
    })),
};
//# sourceMappingURL=review.controller.js.map