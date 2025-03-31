import { type Request, type Response } from 'express';
import { statusCodes } from '@/constants';
import { reviewService } from '@/services';
import { asyncRequestHandlerWrapper, sendResponse } from '@/utils';

export const reviewController = {
    createReview: asyncRequestHandlerWrapper(async (req: Request, res: Response): Promise<void> => {
        const review = await reviewService.createReview(
            req!.jwtPayload!.userId,
            Number(req.params.productId),
            req.body.rating,
            req.body.comment,
        );

        return sendResponse(res, statusCodes.successful.CREATED, { data: review });
    }),

    getReviews: asyncRequestHandlerWrapper(async (req: Request, res: Response): Promise<void> => {
        const reviews = await reviewService.getReviews();

        return sendResponse(res, statusCodes.successful.CREATED, { data: { items: reviews } });
    }),

    updateReview: asyncRequestHandlerWrapper(async (req: Request, res: Response): Promise<void> => {
        const review = await reviewService.updateReview(Number(req.params.reviewId), req.body.rating, req.body.comment);

        return sendResponse(res, statusCodes.successful.OK, { data: review });
    }),

    deleteReview: asyncRequestHandlerWrapper(async (req: Request, res: Response): Promise<void> => {
        const review = await reviewService.deleteReview(req!.jwtPayload!.userId, Number(req.params.reviewId));

        return sendResponse(res, statusCodes.successful.OK, { data: review });
    }),
};
