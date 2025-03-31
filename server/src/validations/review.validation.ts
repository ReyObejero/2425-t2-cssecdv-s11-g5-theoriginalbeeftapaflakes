import { z } from 'zod';
import { errorMessages } from '@/constants';

export const createReviewSchema = z.object({
    params: z.object({
        productId: z
            .string()
            .transform((productId) => Number(productId))
            .refine((productId) => !isNaN(productId), { message: errorMessages.PRODUCT_ID_INVALID }),
    }),
    body: z.object({
        rating: z
            .number({ message: errorMessages.REVIEW_RATING_INVALID })
            .refine((rating) => rating >= 0 && rating <= 5, { message: errorMessages.REVIEW_RATING_INVALID }),
        comment: z
            .string({ message: errorMessages.REVIEW_COMMENT_INVALID })
            .min(1, { message: errorMessages.REVIEW_COMMENT_EMPTY }),
    }),
});

export const updateReviewSchema = z.object({
    params: z.object({
        reviewId: z
            .string()
            .transform((reviewId) => Number(reviewId))
            .refine((reviewId) => !isNaN(reviewId), { message: errorMessages.REVIEW_ID_INVALID }),
    }),
    body: z.object({
        rating: z
            .number({ message: errorMessages.REVIEW_RATING_INVALID })
            .refine((rating) => rating >= 0 && rating <= 5, { message: errorMessages.REVIEW_RATING_INVALID }),
        comment: z
            .string({ message: errorMessages.REVIEW_COMMENT_INVALID })
            .min(1, { message: errorMessages.REVIEW_COMMENT_EMPTY }),
    }),
});

export const deleteReviewSchema = z.object({
    params: z.object({
        reviewId: z
            .string()
            .transform((reviewId) => Number(reviewId))
            .refine((reviewId) => !isNaN(reviewId), { message: errorMessages.REVIEW_ID_INVALID }),
    }),
});
