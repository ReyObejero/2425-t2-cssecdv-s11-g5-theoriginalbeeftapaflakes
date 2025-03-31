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
exports.authController = void 0;
const config_1 = require("../config");
const constants_1 = require("../constants");
const services_1 = require("../services");
const utils_1 = require("../utils");
exports.authController = {
    register: (0, utils_1.asyncRequestHandlerWrapper)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const user = yield services_1.authService.register(req.body, (_a = req.jwtPayload) === null || _a === void 0 ? void 0 : _a.role);
        return (0, utils_1.sendResponse)(res, constants_1.statusCodes.successful.CREATED, { data: user });
    })),
    login: (0, utils_1.asyncRequestHandlerWrapper)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { accessToken, refreshToken, user } = yield services_1.authService.login(req.body, req.cookies[config_1.env.jwt.REFRESH_TOKEN_COOKIE_NAME]);
        const cookieOptions = {
            httpOnly: true,
            sameSite: config_1.env.NODE_ENV === 'production' ? 'none' : 'lax',
            secure: config_1.env.NODE_ENV === 'production',
        };
        res.clearCookie(config_1.env.jwt.ACCESS_TOKEN_COOKIE_NAME);
        res.cookie(config_1.env.jwt.ACCESS_TOKEN_COOKIE_NAME, accessToken, Object.assign(Object.assign({}, cookieOptions), { maxAge: (0, utils_1.timeStringToMilliseconds)(config_1.env.jwt.ACCESS_TOKEN_EXPIRE_TIME) }));
        res.clearCookie(config_1.env.jwt.REFRESH_TOKEN_COOKIE_NAME);
        res.cookie(config_1.env.jwt.REFRESH_TOKEN_COOKIE_NAME, refreshToken, Object.assign(Object.assign({}, cookieOptions), { maxAge: (0, utils_1.timeStringToMilliseconds)(config_1.env.jwt.REFRESH_TOKEN_EXPIRE_TIME) }));
        return (0, utils_1.sendResponse)(res, constants_1.statusCodes.successful.CREATED, { data: user });
    })),
    logout: (0, utils_1.asyncRequestHandlerWrapper)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const user = yield services_1.authService.logout(req.jwtPayload.userId);
        res.clearCookie(config_1.env.jwt.ACCESS_TOKEN_COOKIE_NAME);
        res.clearCookie(config_1.env.jwt.REFRESH_TOKEN_COOKIE_NAME);
        return (0, utils_1.sendResponse)(res, constants_1.statusCodes.successful.OK, { data: user });
    })),
};
//# sourceMappingURL=auth.controller.js.map