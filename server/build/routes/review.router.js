"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reviewRouter = void 0;
const express_1 = require("express");
const controllers_1 = require("../controllers");
const middlewares_1 = require("../middlewares");
const validations_1 = require("../validations");
const reviewRouter = (0, express_1.Router)();
exports.reviewRouter = reviewRouter;
reviewRouter.post('/:productId', middlewares_1.authenticate, (0, middlewares_1.validate)(validations_1.createReviewSchema), controllers_1.reviewController.createReview);
reviewRouter.get('/', controllers_1.reviewController.getReviews);
reviewRouter.put('/:reviewId', middlewares_1.authenticate, (0, middlewares_1.validate)(validations_1.updateReviewSchema), controllers_1.reviewController.updateReview);
reviewRouter.delete('/:reviewId', middlewares_1.authenticate, (0, middlewares_1.validate)(validations_1.deleteReviewSchema), controllers_1.reviewController.deleteReview);
//# sourceMappingURL=review.router.js.map