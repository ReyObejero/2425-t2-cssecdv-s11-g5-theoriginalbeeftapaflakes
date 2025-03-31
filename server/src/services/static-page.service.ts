import { Prisma, type StaticPageElement } from '@prisma/client';
import createError from 'http-errors';
import { errorMessages, statusCodes } from '@/constants';
import { prismaClient } from '@/database';

export type DetailedStaticPage = Prisma.StaticPageGetPayload<{
    include: {
        elements: true;
    };
}>;

const detailedStaticPageQueryArgs = {
    include: {
        elements: true,
    },
};

const generateSlug = (string: string): string => {
    return string.toLocaleLowerCase().trim().replace(/\s/g, '-');
};

export const staticPageService = {
    createStaticPage: async (title: string): Promise<DetailedStaticPage> => {
        if (!title || (await staticPageService.getStaticPageBySlug(generateSlug(title)))) {
            throw createError(statusCodes.clientError.BAD_REQUEST, errorMessages.STATIC_PAGE_TITLE_INVALID);
        }

        return await prismaClient.staticPage.create({
            data: { title, slug: generateSlug(title) },
            ...detailedStaticPageQueryArgs,
        });
    },

    createStaticPageElement: async (
        staticPageSlug: string,
        title: string,
        content: string,
    ): Promise<StaticPageElement> => {
        if (!staticPageSlug) {
            throw createError(statusCodes.clientError.BAD_REQUEST, errorMessages.STATIC_PAGE_SLUG_INVALID);
        }

        const staticPage = await staticPageService.getStaticPageBySlug(staticPageSlug);
        if (!staticPage) {
            throw createError(statusCodes.clientError.BAD_REQUEST, errorMessages.STATIC_PAGE_SLUG_INVALID);
        }

        if (!content) {
            throw createError(statusCodes.clientError.BAD_REQUEST, errorMessages.STATIC_PAGE_ELEMENT_CONTENT_INVALID);
        }

        if (!title) {
            throw createError(statusCodes.clientError.BAD_REQUEST, errorMessages.STATIC_PAGE_ELEMENT_TITLE_INVALID);
        }

        return await prismaClient.staticPageElement.create({
            data: { staticPageId: staticPage.id, title, content },
        });
    },

    getStaticPageById: async (staticPageId: number): Promise<DetailedStaticPage | null> => {
        if (!staticPageId) {
            throw createError(statusCodes.clientError.BAD_REQUEST, errorMessages.STATIC_PAGE_ID_INVALID);
        }

        return prismaClient.staticPage.findUnique({ where: { id: staticPageId }, ...detailedStaticPageQueryArgs });
    },

    getStaticPageBySlug: async (slug: string): Promise<DetailedStaticPage | null> => {
        if (!slug) {
            throw createError(statusCodes.clientError.BAD_REQUEST, errorMessages.STATIC_PAGE_SLUG_INVALID);
        }

        return prismaClient.staticPage.findUnique({ where: { slug }, ...detailedStaticPageQueryArgs });
    },

    getStaticPageElement: async (elementId: number): Promise<StaticPageElement | null> => {
        if (!elementId) {
            throw createError(statusCodes.clientError.BAD_REQUEST, errorMessages.STATIC_PAGE_ELEMENT_ID_INVALID);
        }

        return await prismaClient.staticPageElement.findUnique({ where: { id: elementId } });
    },

    getStaticPages: async (): Promise<DetailedStaticPage[]> => {
        return await prismaClient.staticPage.findMany(detailedStaticPageQueryArgs);
    },

    updateStaticPageElement: async (elementId: number, title: string, content: string): Promise<StaticPageElement> => {
        if (!elementId || !(await staticPageService.getStaticPageElement(elementId))) {
            throw createError(statusCodes.clientError.BAD_REQUEST, errorMessages.STATIC_PAGE_ELEMENT_ID_INVALID);
        }

        if (!title) {
            throw createError(statusCodes.clientError.BAD_REQUEST, errorMessages.STATIC_PAGE_ELEMENT_TITLE_INVALID);
        }

        if (!content) {
            throw createError(statusCodes.clientError.BAD_REQUEST, errorMessages.STATIC_PAGE_ELEMENT_CONTENT_INVALID);
        }

        return await prismaClient.staticPageElement.update({ where: { id: elementId }, data: { title, content } });
    },

    deleteStaticPageElement: async (elementId: number): Promise<StaticPageElement> => {
        if (!elementId || !(await staticPageService.getStaticPageElement(elementId))) {
            throw createError(statusCodes.clientError.BAD_REQUEST, errorMessages.STATIC_PAGE_ELEMENT_ID_INVALID);
        }

        return await prismaClient.staticPageElement.delete({ where: { id: elementId } });
    },
};
