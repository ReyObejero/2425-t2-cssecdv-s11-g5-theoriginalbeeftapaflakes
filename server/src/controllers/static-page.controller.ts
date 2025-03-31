import { type Request, type Response } from 'express';
import { statusCodes } from '@/constants';
import { staticPageService } from '@/services';
import { asyncRequestHandlerWrapper, sendResponse } from '@/utils';

export const staticPageController = {
    createStaticPage: asyncRequestHandlerWrapper(async (req: Request, res: Response): Promise<void> => {
        const staticPage = await staticPageService.createStaticPage(req.body.title);

        return sendResponse(res, statusCodes.successful.CREATED, { data: staticPage });
    }),

    createStaticPageElement: asyncRequestHandlerWrapper(async (req: Request, res: Response): Promise<void> => {
        const staticPageElement = await staticPageService.createStaticPageElement(
            req.params.staticPageSlug,
            req.body.title,
            req.body.content,
        );

        return sendResponse(res, statusCodes.successful.CREATED, { data: staticPageElement });
    }),

    getStaticPage: asyncRequestHandlerWrapper(async (req: Request, res: Response): Promise<void> => {
        const staticPage = await staticPageService.getStaticPageBySlug(req.params.staticPageSlug);

        return sendResponse(res, statusCodes.successful.OK, { data: staticPage });
    }),

    getStaticPages: asyncRequestHandlerWrapper(async (req: Request, res: Response): Promise<void> => {
        const staticPages = await staticPageService.getStaticPages();

        return sendResponse(res, statusCodes.successful.OK, { data: { items: staticPages } });
    }),

    updateStaticPageElement: asyncRequestHandlerWrapper(async (req: Request, res: Response): Promise<void> => {
        const staticPageElement = await staticPageService.updateStaticPageElement(
            Number(req.params.staticPageElementId),
            req.body.title,
            req.body.content,
        );

        return sendResponse(res, statusCodes.successful.OK, { data: staticPageElement });
    }),

    deleteStaticPageElement: asyncRequestHandlerWrapper(async (req: Request, res: Response): Promise<void> => {
        const staticPageElement = await staticPageService.deleteStaticPageElement(
            Number(req.params.staticPageElementId),
        );

        return sendResponse(res, statusCodes.successful.OK, { data: staticPageElement });
    }),
};
