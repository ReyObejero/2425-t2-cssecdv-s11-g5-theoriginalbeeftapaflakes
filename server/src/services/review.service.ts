import { Prisma, type Review } from '@prisma/client';
import createError from 'http-errors';
import { errorMessages, statusCodes } from '@/constants';
import { prismaClient } from '@/database';
import { userService } from './user.service';
import { productService } from './product.service';

export type DetailedReview = Prisma.ReviewGetPayload<{
    include: {
        user: true;
    };
}>;

const detailedReviewQueryArgs = {
    include: {
        user: true,
    },
};

export const reviewService = {
    createReview: async (
        userId: number,
        productId: number,
        rating: number,
        comment: string,
    ): Promise<DetailedReview> => {
        if (!userId || !(await userService.getUserById(userId))) {
            throw createError(statusCodes.clientError.BAD_REQUEST, errorMessages.USER_ID_INVALID);
        }

        if (!productId || !(await productService.getProduct(productId))) {
            throw createError(statusCodes.clientError.BAD_REQUEST, errorMessages.PRODUCT_ID_INVALID);
        }

        if (!rating) {
            if (rating != 0) {
                throw createError(statusCodes.clientError.BAD_REQUEST, errorMessages.REVIEW_RATING_INVALID);
            }
        }

        if (!comment) {
            if (comment === '') {
                throw createError(statusCodes.clientError.BAD_REQUEST, errorMessages.REVIEW_COMMENT_EMPTY);
            }

            throw createError(statusCodes.clientError.BAD_REQUEST, errorMessages.REVIEW_COMMENT_INVALID);
        }

        if (await reviewService.getReviewByProductId(userId, productId)) {
            throw createError(statusCodes.clientError.BAD_REQUEST, errorMessages.USER_REVIEW_ALREADY_EXISTS);
        }

        const review = await prismaClient.review.create({
            data: { userId, productId, rating, comment },
            ...detailedReviewQueryArgs,
        });

        await productService.updateProductAverageRating(productId);

        return review;
    },

    getReviewById: async (reviewId: number): Promise<DetailedReview | null> => {
        if (!reviewId) {
            throw createError(statusCodes.clientError.BAD_REQUEST, errorMessages.REVIEW_ID_INVALID);
        }

        return prismaClient.review.findFirst({ where: { id: reviewId }, ...detailedReviewQueryArgs });
    },

    getReviewByProductId: async (userId: number, productId: number): Promise<DetailedReview | null> => {
        if (!userId || !(await userService.getUserById(userId))) {
            throw createError(statusCodes.clientError.BAD_REQUEST, errorMessages.USER_ID_INVALID);
        }

        if (!productId || !(await productService.getProduct(productId))) {
            throw createError(statusCodes.clientError.BAD_REQUEST, errorMessages.PRODUCT_ID_INVALID);
        }

        return prismaClient.review.findFirst({ where: { userId, productId }, ...detailedReviewQueryArgs });
    },

    getReviews: async (): Promise<DetailedReview[]> => {
        return await prismaClient.review.findMany({ ...detailedReviewQueryArgs });
    },

    updateReview: async (reviewId: number, rating: number, comment: string): Promise<DetailedReview> => {
        if (!reviewId) {
            throw createError(statusCodes.clientError.BAD_REQUEST, errorMessages.USER_ID_INVALID);
        }

        if (!rating) {
            if (rating != 0) {
                throw createError(statusCodes.clientError.BAD_REQUEST, errorMessages.REVIEW_RATING_INVALID);
            }
        }

        if (!comment) {
            if (comment === '') {
                throw createError(statusCodes.clientError.BAD_REQUEST, errorMessages.REVIEW_COMMENT_EMPTY);
            }

            throw createError(statusCodes.clientError.BAD_REQUEST, errorMessages.REVIEW_COMMENT_INVALID);
        }

        const existingReview = await reviewService.getReviewById(reviewId);
        if (!existingReview) {
            throw createError(statusCodes.clientError.BAD_REQUEST, errorMessages.REVIEW_ID_INVALID);
        }

        const review = await prismaClient.review.update({
            where: { id: reviewId },
            data: { rating, comment },
            ...detailedReviewQueryArgs,
        });

        await productService.updateProductAverageRating(review.productId);

        return review;
    },

    deleteReview: async (userId: number, reviewId: number): Promise<DetailedReview> => {
        if (!userId || !(await userService.getUserById(userId))) {
            throw createError(statusCodes.clientError.BAD_REQUEST, errorMessages.USER_ID_INVALID);
        }

        if (!reviewId) {
            throw createError(statusCodes.clientError.BAD_REQUEST, errorMessages.REVIEW_ID_INVALID);
        }

        const review = await reviewService.getReviewById(reviewId);
        if (!review) {
            throw createError(statusCodes.clientError.BAD_REQUEST, errorMessages.REVIEW_ID_INVALID);
        }

        if (review.userId != userId) {
            throw createError(statusCodes.clientError.BAD_REQUEST, errorMessages.USER_DELETE_REVIEW_DENIED);
        }

        await prismaClient.review.delete({ where: { id: reviewId } });

        await productService.updateProductAverageRating(review.productId);

        return review;
    },
};
