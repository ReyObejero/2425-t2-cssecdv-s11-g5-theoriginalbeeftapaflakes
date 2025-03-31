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
exports.reportService = void 0;
const database_1 = require("../database");
exports.reportService = {
    getSales: (productId, packageId, orderStatus, startDate, endDate) => __awaiter(void 0, void 0, void 0, function* () {
        return yield database_1.prismaClient.order.groupBy({
            by: ['productId', 'packageId'],
            where: {
                productId,
                packageId,
                status: {
                    not: 'CANCELLED',
                    equals: orderStatus,
                },
                createdAt: Object.assign(Object.assign({}, (startDate && { gte: startDate })), (endDate && { lte: endDate })),
            },
            _count: {
                id: true,
            },
            _sum: {
                price: true,
            },
        });
    }),
};
//# sourceMappingURL=report.service.js.map