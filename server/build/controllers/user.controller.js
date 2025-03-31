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
exports.userController = void 0;
const constants_1 = require("../constants");
const services_1 = require("../services");
const utils_1 = require("../utils");
exports.userController = {
    getAuthenticatedUser: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const user = yield services_1.userService.getUserById(req.jwtPayload.userId);
        return (0, utils_1.sendResponse)(res, constants_1.statusCodes.successful.OK, { data: user });
    }),
    getUser: (0, utils_1.asyncRequestHandlerWrapper)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const user = yield services_1.userService.getUserByUsername(req.params.username);
        return (0, utils_1.sendResponse)(res, constants_1.statusCodes.successful.OK, { data: user });
    })),
    getUsers: (0, utils_1.asyncRequestHandlerWrapper)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const users = yield services_1.userService.getUsers();
        return (0, utils_1.sendResponse)(res, constants_1.statusCodes.successful.OK, {
            data: { items: users },
        });
    })),
    updateUser: (0, utils_1.asyncRequestHandlerWrapper)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { address } = req.body;
        const user = yield services_1.userService.updateUserAddress(req.params.username, address);
        return (0, utils_1.sendResponse)(res, constants_1.statusCodes.successful.OK, {
            data: user,
        });
    })),
};
//# sourceMappingURL=user.controller.js.map