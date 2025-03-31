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
exports.staticPageController = void 0;
const constants_1 = require("../constants");
const services_1 = require("../services");
const utils_1 = require("../utils");
exports.staticPageController = {
    createStaticPage: (0, utils_1.asyncRequestHandlerWrapper)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const staticPage = yield services_1.staticPageService.createStaticPage(req.body.title);
        return (0, utils_1.sendResponse)(res, constants_1.statusCodes.successful.CREATED, { data: staticPage });
    })),
    createStaticPageElement: (0, utils_1.asyncRequestHandlerWrapper)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const staticPageElement = yield services_1.staticPageService.createStaticPageElement(req.params.staticPageSlug, req.body.title, req.body.content);
        return (0, utils_1.sendResponse)(res, constants_1.statusCodes.successful.CREATED, { data: staticPageElement });
    })),
    getStaticPage: (0, utils_1.asyncRequestHandlerWrapper)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const staticPage = yield services_1.staticPageService.getStaticPageBySlug(req.params.staticPageSlug);
        return (0, utils_1.sendResponse)(res, constants_1.statusCodes.successful.OK, { data: staticPage });
    })),
    getStaticPages: (0, utils_1.asyncRequestHandlerWrapper)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const staticPages = yield services_1.staticPageService.getStaticPages();
        return (0, utils_1.sendResponse)(res, constants_1.statusCodes.successful.OK, { data: { items: staticPages } });
    })),
    updateStaticPageElement: (0, utils_1.asyncRequestHandlerWrapper)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const staticPageElement = yield services_1.staticPageService.updateStaticPageElement(Number(req.params.staticPageElementId), req.body.title, req.body.content);
        return (0, utils_1.sendResponse)(res, constants_1.statusCodes.successful.OK, { data: staticPageElement });
    })),
    deleteStaticPageElement: (0, utils_1.asyncRequestHandlerWrapper)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const staticPageElement = yield services_1.staticPageService.deleteStaticPageElement(Number(req.params.staticPageElementId));
        return (0, utils_1.sendResponse)(res, constants_1.statusCodes.successful.OK, { data: staticPageElement });
    })),
};
//# sourceMappingURL=static-page.controller.js.map