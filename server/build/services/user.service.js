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
exports.userService = void 0;
const http_errors_1 = __importDefault(require("http-errors"));
const constants_1 = require("../constants");
const database_1 = require("../database");
exports.userService = {
    getUserByEmail: (email) => __awaiter(void 0, void 0, void 0, function* () {
        if (!email) {
            throw (0, http_errors_1.default)(constants_1.statusCodes.clientError.BAD_REQUEST, constants_1.errorMessages.EMAIL_INVALID);
        }
        return yield database_1.prismaClient.user.findUnique({
            where: { email },
        });
    }),
    getUserById: (userId) => __awaiter(void 0, void 0, void 0, function* () {
        if (!userId) {
            throw (0, http_errors_1.default)(constants_1.statusCodes.clientError.BAD_REQUEST, constants_1.errorMessages.USER_ID_INVALID);
        }
        return yield database_1.prismaClient.user.findUnique({
            where: { id: userId },
        });
    }),
    getUserByUsername: (username) => __awaiter(void 0, void 0, void 0, function* () {
        if (!username) {
            throw (0, http_errors_1.default)(constants_1.statusCodes.clientError.BAD_REQUEST, constants_1.errorMessages.USERNAME_INVALID);
        }
        return yield database_1.prismaClient.user.findUnique({
            where: { username },
        });
    }),
    getUsers: () => __awaiter(void 0, void 0, void 0, function* () {
        return yield database_1.prismaClient.user.findMany();
    }),
    updateUserAddress: (username, address) => __awaiter(void 0, void 0, void 0, function* () {
        if (!username || !(yield exports.userService.getUserByUsername(username))) {
            throw (0, http_errors_1.default)(constants_1.statusCodes.clientError.BAD_REQUEST, constants_1.errorMessages.USERNAME_INVALID);
        }
        if (!address) {
            throw (0, http_errors_1.default)(constants_1.statusCodes.clientError.BAD_REQUEST, constants_1.errorMessages.USER_ADDRESS_INVALID);
        }
        return yield database_1.prismaClient.user.update({ where: { username }, data: { address } });
    }),
};
//# sourceMappingURL=user.service.js.map