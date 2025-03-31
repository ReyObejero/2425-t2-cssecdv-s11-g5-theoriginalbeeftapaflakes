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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.tokenService = void 0;
const http_errors_1 = __importDefault(require("http-errors"));
const constants_1 = require("../constants");
const database_1 = require("../database");
exports.tokenService = {
    createRefreshToken: (userId, token) => __awaiter(void 0, void 0, void 0, function* () {
        if (!userId) {
            throw (0, http_errors_1.default)(constants_1.statusCodes.clientError.BAD_REQUEST, constants_1.errorMessages.USER_ID_INVALID);
        }
        if (!token) {
            throw (0, http_errors_1.default)(constants_1.statusCodes.clientError.BAD_REQUEST, constants_1.errorMessages.TOKEN_INVALID);
        }
        return yield database_1.prismaClient.refreshToken.create({ data: { userId, token } });
    }),
    deleteRefreshTokensByUserId: (userId) => __awaiter(void 0, void 0, void 0, function* () {
        if (!userId) {
            throw (0, http_errors_1.default)(constants_1.statusCodes.clientError.BAD_REQUEST, constants_1.errorMessages.USER_ID_INVALID);
        }
        const refreshTokens = yield exports.tokenService.getRefreshTokensByUserId(userId);
        yield database_1.prismaClient.refreshToken.deleteMany({ where: { id: userId } });
        return refreshTokens;
    }),
    deleteRefreshTokenByToken: (token) => __awaiter(void 0, void 0, void 0, function* () {
        if (!token) {
            throw (0, http_errors_1.default)(constants_1.statusCodes.clientError.BAD_REQUEST, constants_1.errorMessages.TOKEN_INVALID);
        }
        if (!(yield exports.tokenService.getRefreshTokenByToken(token))) {
            throw (0, http_errors_1.default)(constants_1.statusCodes.clientError.BAD_REQUEST, constants_1.errorMessages.TOKEN_NOT_FOUND);
        }
        return yield database_1.prismaClient.refreshToken.delete({ where: { token } });
    }),
    getRefreshTokenByToken: (token) => __awaiter(void 0, void 0, void 0, function* () {
        if (!token) {
            throw (0, http_errors_1.default)(constants_1.statusCodes.clientError.BAD_REQUEST, constants_1.errorMessages.TOKEN_INVALID);
        }
        return yield database_1.prismaClient.refreshToken.findUnique({ where: { token } });
    }),
    getRefreshTokensByUserId: (userId) => __awaiter(void 0, void 0, void 0, function* () {
        if (!userId) {
            throw (0, http_errors_1.default)(constants_1.statusCodes.clientError.BAD_REQUEST, constants_1.errorMessages.USER_ID_INVALID);
        }
        return yield database_1.prismaClient.refreshToken.findMany({ where: { userId } });
    }),
};
//# sourceMappingURL=token.service.js.map