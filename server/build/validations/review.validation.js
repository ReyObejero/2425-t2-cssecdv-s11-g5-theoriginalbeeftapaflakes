"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteReviewSchema = exports.updateReviewSchema = exports.createReviewSchema = void 0;
const zod_1 = require("zod");
const constants_1 = require("../constants");
exports.createReviewSchema = zod_1.z.object({
    params: zod_1.z.object({
        productId: zod_1.z
            .string()
            .transform((productId) => Number(productId))
            .refine((productId) => !isNaN(productId), { message: constants_1.errorMessages.PRODUCT_ID_INVALID }),
    }),
    body: zod_1.z.object({
        rating: zod_1.z
            .number({ message: constants_1.errorMessages.REVIEW_RATING_INVALID })
            .refine((rating) => rating >= 0 && rating <= 5, { message: constants_1.errorMessages.REVIEW_RATING_INVALID }),
        comment: zod_1.z
            .string({ message: constants_1.errorMessages.REVIEW_COMMENT_INVALID })
            .min(1, { message: constants_1.errorMessages.REVIEW_COMMENT_EMPTY }),
    }),
});
exports.updateReviewSchema = zod_1.z.object({
    params: zod_1.z.object({
        reviewId: zod_1.z
            .string()
            .transform((reviewId) => Number(reviewId))
            .refine((reviewId) => !isNaN(reviewId), { message: constants_1.errorMessages.REVIEW_ID_INVALID }),
    }),
    body: zod_1.z.object({
        rating: zod_1.z
            .number({ message: constants_1.errorMessages.REVIEW_RATING_INVALID })
            .refine((rating) => rating >= 0 && rating <= 5, { message: constants_1.errorMessages.REVIEW_RATING_INVALID }),
        comment: zod_1.z
            .string({ message: constants_1.errorMessages.REVIEW_COMMENT_INVALID })
            .min(1, { message: constants_1.errorMessages.REVIEW_COMMENT_EMPTY }),
    }),
});
exports.deleteReviewSchema = zod_1.z.object({
    params: zod_1.z.object({
        reviewId: zod_1.z
            .string()
            .transform((reviewId) => Number(reviewId))
            .refine((reviewId) => !isNaN(reviewId), { message: constants_1.errorMessages.REVIEW_ID_INVALID }),
    }),
});
//# sourceMappingURL=review.validation.js.map