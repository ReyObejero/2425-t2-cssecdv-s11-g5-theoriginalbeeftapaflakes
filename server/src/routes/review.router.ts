import { Router } from 'express';
import { reviewController } from '@/controllers';
import { authenticate, validate } from '@/middlewares';
import { createReviewSchema, deleteReviewSchema, updateReviewSchema } from '@/validations';

const reviewRouter = Router();

reviewRouter.post('/:productId', authenticate, validate(createReviewSchema), reviewController.createReview);
reviewRouter.get('/', reviewController.getReviews);
reviewRouter.put('/:reviewId', authenticate, validate(updateReviewSchema), reviewController.updateReview);
reviewRouter.delete('/:reviewId', authenticate, validate(deleteReviewSchema), reviewController.deleteReview);

export { reviewRouter };
