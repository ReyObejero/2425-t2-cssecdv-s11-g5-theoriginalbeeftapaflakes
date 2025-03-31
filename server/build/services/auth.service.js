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
exports.authService = void 0;
const argon2_1 = require("argon2");
const http_errors_1 = __importDefault(require("http-errors"));
const constants_1 = require("../constants");
const database_1 = require("../database");
const utils_1 = require("../utils");
const token_service_1 = require("./token.service");
const user_service_1 = require("./user.service");
exports.authService = {
    register: (input, role) => __awaiter(void 0, void 0, void 0, function* () {
        const { username, email, password } = input;
        if (!username) {
            throw (0, http_errors_1.default)(constants_1.statusCodes.clientError.BAD_REQUEST, constants_1.errorMessages.USERNAME_INVALID);
        }
        if (!email) {
            throw (0, http_errors_1.default)(constants_1.statusCodes.clientError.BAD_REQUEST, constants_1.errorMessages.EMAIL_INVALID);
        }
        if (!password) {
            throw (0, http_errors_1.default)(constants_1.statusCodes.clientError.BAD_REQUEST, constants_1.errorMessages.USERNAME_INVALID);
        }
        if (yield user_service_1.userService.getUserByUsername(username)) {
            throw (0, http_errors_1.default)(constants_1.statusCodes.clientError.CONFLICT, constants_1.errorMessages.USERNAME_ALREADY_IN_USE);
        }
        if (yield user_service_1.userService.getUserByEmail(email)) {
            throw (0, http_errors_1.default)(constants_1.statusCodes.clientError.CONFLICT, constants_1.errorMessages.EMAIL_ALREADY_IN_USE);
        }
        return yield database_1.prismaClient.user.create({
            data: Object.assign({ username,
                email, password: yield (0, argon2_1.hash)(password), profilePhotoUrl: 'https://asset.cloudinary.com/dqfjotjba/387e2481f384f9748dd285b3d059c92c' }, (role && role !== 'USER' && { role })),
        });
    }),
    login: (input, refreshToken) => __awaiter(void 0, void 0, void 0, function* () {
        const { username, password } = input;
        if (!username) {
            throw (0, http_errors_1.default)(constants_1.statusCodes.clientError.BAD_REQUEST, constants_1.errorMessages.USERNAME_INVALID);
        }
        if (!password) {
            throw (0, http_errors_1.default)(constants_1.statusCodes.clientError.BAD_REQUEST, constants_1.errorMessages.PASSWORD_INVALID);
        }
        const user = yield user_service_1.userService.getUserByUsername(username);
        if (!user) {
            throw (0, http_errors_1.default)(constants_1.statusCodes.clientError.NOT_FOUND, constants_1.errorMessages.USERNAME_INVALID);
        }
        if (!(yield (0, argon2_1.verify)(user.password, password))) {
            throw (0, http_errors_1.default)(constants_1.statusCodes.clientError.UNAUTHORIZED, constants_1.errorMessages.PASSWORD_INVALID);
        }
        if (refreshToken) {
            const existingRefreshToken = yield token_service_1.tokenService.getRefreshTokenByToken(refreshToken);
            if (!existingRefreshToken || existingRefreshToken.userId != user.id) {
                yield token_service_1.tokenService.deleteRefreshTokensByUserId(user.id);
            }
            else {
                yield token_service_1.tokenService.deleteRefreshTokenByToken(existingRefreshToken.token);
            }
        }
        const accessToken = (0, utils_1.generateAccessToken)(user.id, user.role);
        const newRefreshToken = (0, utils_1.generateRefreshToken)(user.id, user.role);
        yield token_service_1.tokenService.createRefreshToken(user.id, newRefreshToken);
        return {
            accessToken,
            refreshToken: newRefreshToken,
            user,
        };
    }),
    logout: (userId) => __awaiter(void 0, void 0, void 0, function* () {
        if (!userId) {
            throw (0, http_errors_1.default)(constants_1.statusCodes.clientError.NOT_FOUND, constants_1.errorMessages.USER_ID_INVALID);
        }
        const user = yield user_service_1.userService.getUserById(userId);
        if (!user) {
            throw (0, http_errors_1.default)(constants_1.statusCodes.clientError.NOT_FOUND, constants_1.errorMessages.USER_ID_INVALID);
        }
        yield token_service_1.tokenService.deleteRefreshTokensByUserId(userId);
        return user;
    }),
};
//# sourceMappingURL=auth.service.js.map