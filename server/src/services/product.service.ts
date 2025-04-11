import { Prisma } from '@prisma/client';
import createError from 'http-errors';
import { errorMessages, statusCodes } from '@/constants';
import { prismaClient } from '@/database';
import { reviewService } from './review.service';

export type DetailedProduct = Prisma.ProductGetPayload<{
    include: {
        packages: {
            include: {
                items: {
                    include: {
                        flavor: true;
                        flavorVariant: true;
                    };
                };
            };
        };
    };
}>;

export type DetailedPackage = Prisma.PackageGetPayload<{
    include: {
        items: {
            include: {
                flavor: true;
                flavorVariant: true;
            };
        };
    };
}>;

const detailedProductQueryArgs = {
    include: {
        packages: {
            include: {
                items: {
                    include: {
                        flavor: true,
                        flavorVariant: true,
                    },
                },
            },
        },
    },
};

const detailedPackageQueryArgs = {
    include: {
        items: {
            include: {
                flavor: true,
                flavorVariant: true,
            },
        },
    },
};

export const productService = {
    createProduct: async (data: Prisma.ProductCreateInput): Promise<DetailedProduct> => {
        return await prismaClient.product.create({
            data,
            ...detailedProductQueryArgs,
        });
    },

    updateProduct: async (productId: number, data: Prisma.ProductUpdateInput): Promise<DetailedProduct> => {
        return await prismaClient.product.update({
            where: { id: productId },
            data,
            ...detailedProductQueryArgs,
        });
    },

    deletePackage: async (productId: number, packageId: number): Promise<DetailedPackage> => {
        if (!productId || !packageId) {
            throw createError(statusCodes.clientError.BAD_REQUEST, errorMessages.INVALID_INPUT);
        }
        const productPackage = await prismaClient.package.findUnique({
            where: { id: packageId },
            ...detailedPackageQueryArgs,
        });
        if (!productPackage) {
            throw createError(statusCodes.clientError.NOT_FOUND, errorMessages.INVALID_INPUT);
        }
        await prismaClient.package.delete({ where: { id: packageId } });
        return productPackage;
    },

    getPackage: async (packageId: number): Promise<DetailedPackage | null> => {
        return await prismaClient.package.findUnique({
            where: { id: packageId },
            ...detailedPackageQueryArgs,
        });
    },

    getPackages: async (productId: number): Promise<DetailedPackage[]> => {
        return await prismaClient.package.findMany({
            where: { productId },
            ...detailedPackageQueryArgs,
        });
    },

    getProduct: async (productId: number): Promise<DetailedProduct | null> => {
        return await prismaClient.product.findUnique({
            where: { id: productId },
            ...detailedProductQueryArgs,
        });
    },

    getProducts: async (): Promise<DetailedProduct[]> => {
        return await prismaClient.product.findMany({
            ...detailedProductQueryArgs,
        });
    },

    deleteProduct: async (productId: number): Promise<DetailedProduct> => {
        const product = await prismaClient.product.delete({ where: { id: productId }, ...detailedProductQueryArgs });
        return product;
    },

    updateProductAverageRating: async (productId: number): Promise<DetailedProduct> => {
        const reviews = await reviewService.getReviews();
        const sumRatings = reviews.reduce((accumulator, currentReview) => {
            return accumulator + currentReview.rating;
        }, 0);

        return await prismaClient.product.update({
            where: { id: productId },
            data: { averageRating: sumRatings / reviews.length },
            ...detailedProductQueryArgs,
        });
    },
};
