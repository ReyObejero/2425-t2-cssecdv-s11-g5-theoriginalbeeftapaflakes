"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = require("../prisma");
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const flavors = {
            classic: yield prisma_1.prismaClient.flavor.create({
                data: {
                    name: 'Classic',
                },
            }),
            spicy: yield prisma_1.prismaClient.flavor.create({
                data: {
                    name: 'Spicy',
                },
            }),
            sisig: yield prisma_1.prismaClient.flavor.create({
                data: {
                    name: 'Sisig',
                },
            }),
        };
        const flavorVariants = {
            classic: {
                '330g': yield prisma_1.prismaClient.flavorVariant.create({
                    data: {
                        flavorId: flavors.classic.id,
                        size: '330g',
                        stock: 100,
                    },
                }),
                '550g': yield prisma_1.prismaClient.flavorVariant.create({
                    data: {
                        flavorId: flavors.classic.id,
                        size: '550g',
                        stock: 100,
                    },
                }),
            },
            spicy: {
                '330g': yield prisma_1.prismaClient.flavorVariant.create({
                    data: {
                        flavorId: flavors.spicy.id,
                        size: '330g',
                        stock: 100,
                    },
                }),
                '550g': yield prisma_1.prismaClient.flavorVariant.create({
                    data: {
                        flavorId: flavors.spicy.id,
                        size: '550g',
                        stock: 100,
                    },
                }),
            },
            sisig: {
                '330g': yield prisma_1.prismaClient.flavorVariant.create({
                    data: {
                        flavorId: flavors.sisig.id,
                        size: '330g',
                        stock: 100,
                    },
                }),
                '550g': yield prisma_1.prismaClient.flavorVariant.create({
                    data: {
                        flavorId: flavors.sisig.id,
                        size: '550g',
                        stock: 100,
                    },
                }),
            },
        };
        const products = {
            subSellerPackage: yield prisma_1.prismaClient.product.create({
                data: {
                    name: 'Sub-Reseller Package',
                    description: "Discover convenience and profit with our sub-reseller's package! Enjoy free marketing ads, no freezer needed, and high profits. Selling is easy and customers keep coming back!",
                    ingredients: 'Beef, Salt, Pepper, Soy Sauce, Vinegar, Mixed Spices, and Vegetable Oil',
                    imageUrl: 'https://res.cloudinary.com/dqfjotjba/image/upload/v1721909946/the_original_beef_tapa_flakes/products/sub-reseller-package.jpg',
                    packages: {
                        create: [
                            {
                                name: 'Package A',
                                price: 1975.0,
                                items: {
                                    create: [
                                        {
                                            flavorId: flavors.classic.id,
                                            flavorVariantId: flavorVariants.classic['330g'].id,
                                            quantity: 5,
                                        },
                                        {
                                            flavorId: flavors.sisig.id,
                                            flavorVariantId: flavorVariants.sisig['330g'].id,
                                            quantity: 5,
                                        },
                                        {
                                            flavorId: flavors.spicy.id,
                                            flavorVariantId: flavorVariants.spicy['330g'].id,
                                            quantity: 2,
                                        },
                                    ],
                                },
                            },
                            {
                                name: 'Package B',
                                price: 3075.0,
                                items: {
                                    create: [
                                        {
                                            flavorId: flavors.classic.id,
                                            flavorVariantId: flavorVariants.classic['550g'].id,
                                            quantity: 5,
                                        },
                                        {
                                            flavorId: flavors.sisig.id,
                                            flavorVariantId: flavorVariants.sisig['550g'].id,
                                            quantity: 5,
                                        },
                                        {
                                            flavorId: flavors.spicy.id,
                                            flavorVariantId: flavorVariants.spicy['550g'].id,
                                            quantity: 2,
                                        },
                                    ],
                                },
                            },
                        ],
                    },
                },
            }),
            resellerPackage: yield prisma_1.prismaClient.product.create({
                data: {
                    name: 'Reseller Package',
                    description: "Avail the Reseller's package deal! Enjoy complimentary perks such as free delivery, rebranding (including layout, label, and packaging), a tarpaulin, and exclusive marketing ads featured on our main page. With no need for a freezer, expect great profits and effortless sales. It's the perfect choice for guaranteed repeat buyers!",
                    ingredients: 'Beef, Salt, Pepper, Soy Sauce, Vinegar, Mixed Spices, and Vegetable Oil',
                    imageUrl: 'https://res.cloudinary.com/dqfjotjba/image/upload/v1721910044/the_original_beef_tapa_flakes/products/reseller-package.jpg',
                    packages: {
                        create: [
                            {
                                name: 'Package A',
                                price: 3950.0,
                                items: {
                                    create: [
                                        {
                                            flavorId: flavors.classic.id,
                                            flavorVariantId: flavorVariants.classic['330g'].id,
                                            quantity: 8,
                                        },
                                        {
                                            flavorId: flavors.sisig.id,
                                            flavorVariantId: flavorVariants.sisig['330g'].id,
                                            quantity: 8,
                                        },
                                        {
                                            flavorId: flavors.spicy.id,
                                            flavorVariantId: flavorVariants.spicy['330g'].id,
                                            quantity: 8,
                                        },
                                    ],
                                },
                            },
                            {
                                name: 'Package B',
                                price: 6150.0,
                                items: {
                                    create: [
                                        {
                                            flavorId: flavors.classic.id,
                                            flavorVariantId: flavorVariants.classic['550g'].id,
                                            quantity: 8,
                                        },
                                        {
                                            flavorId: flavors.sisig.id,
                                            flavorVariantId: flavorVariants.sisig['550g'].id,
                                            quantity: 8,
                                        },
                                        {
                                            flavorId: flavors.spicy.id,
                                            flavorVariantId: flavorVariants.spicy['550g'].id,
                                            quantity: 8,
                                        },
                                    ],
                                },
                            },
                        ],
                    },
                },
            }),
            theOriginalBeefTapaFlakes330g: yield prisma_1.prismaClient.product.create({
                data: {
                    name: 'The Original Beef Tapa Flakes (330g)',
                    description: 'You can never go wrong with the most talked about tapa in town! Stop wondering and have a taste of our savory tapa in a jar! No need to cook and ready to eat! It comes with three bursting flavors of Classic, Spicy and Sisig.',
                    ingredients: 'Beef, Salt, Pepper, Soy Sauce, Vinegar, Mixed Spices, and Vegetable Oil',
                    imageUrl: 'https://res.cloudinary.com/dqfjotjba/image/upload/v1721910049/the_original_beef_tapa_flakes/products/the-original-beef-tapa-flakes-330g.jpg',
                    packages: {
                        create: [
                            {
                                name: 'Classic',
                                price: 215.0,
                                items: {
                                    create: {
                                        flavorId: flavors.classic.id,
                                        flavorVariantId: flavorVariants.classic['330g'].id,
                                        quantity: 1,
                                    },
                                },
                            },
                            {
                                name: 'Sisig',
                                price: 215.0,
                                items: {
                                    create: {
                                        flavorId: flavors.classic.id,
                                        flavorVariantId: flavorVariants.sisig['330g'].id,
                                        quantity: 1,
                                    },
                                },
                            },
                            {
                                name: 'Spicy',
                                price: 215.0,
                                items: {
                                    create: {
                                        flavorId: flavors.classic.id,
                                        flavorVariantId: flavorVariants.spicy['330g'].id,
                                        quantity: 1,
                                    },
                                },
                            },
                        ],
                    },
                },
            }),
        };
    });
}
main()
    .then(() => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma_1.prismaClient.$disconnect();
}))
    .catch((error) => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma_1.prismaClient.$disconnect();
    process.exit(1);
}));
//# sourceMappingURL=product.seed.js.map