import { Router } from 'express';
import { staticPageController } from '@/controllers';
import { authenticate, protect } from '@/middlewares';

const staticPageRouter = Router();

staticPageRouter.post('/', authenticate, protect, staticPageController.createStaticPage);
staticPageRouter.post('/:staticPageSlug', authenticate, protect, staticPageController.createStaticPageElement);
staticPageRouter.get('/', authenticate, protect, staticPageController.getStaticPages);
staticPageRouter.get('/:staticPageSlug', authenticate, protect, staticPageController.getStaticPage);
staticPageRouter.put(
    '/:staticPageSlug/:staticPageElementId',
    authenticate,
    protect,
    staticPageController.updateStaticPageElement,
);
staticPageRouter.delete(
    '/:staticPageSlug/:staticPageElementId',
    authenticate,
    protect,
    staticPageController.deleteStaticPageElement,
);

export { staticPageRouter };
