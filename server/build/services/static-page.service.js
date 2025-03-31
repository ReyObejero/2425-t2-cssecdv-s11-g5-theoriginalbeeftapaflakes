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
exports.staticPageService = void 0;
const http_errors_1 = __importDefault(require("http-errors"));
const constants_1 = require("../constants");
const database_1 = require("../database");
const detailedStaticPageQueryArgs = {
    include: {
        elements: true,
    },
};
const generateSlug = (string) => {
    return string.toLocaleLowerCase().trim().replace(/\s/g, '-');
};
exports.staticPageService = {
    createStaticPage: (title) => __awaiter(void 0, void 0, void 0, function* () {
        if (!title || (yield exports.staticPageService.getStaticPageBySlug(generateSlug(title)))) {
            throw (0, http_errors_1.default)(constants_1.statusCodes.clientError.BAD_REQUEST, constants_1.errorMessages.STATIC_PAGE_TITLE_INVALID);
        }
        return yield database_1.prismaClient.staticPage.create(Object.assign({ data: { title, slug: generateSlug(title) } }, detailedStaticPageQueryArgs));
    }),
    createStaticPageElement: (staticPageSlug, title, content) => __awaiter(void 0, void 0, void 0, function* () {
        if (!staticPageSlug) {
            throw (0, http_errors_1.default)(constants_1.statusCodes.clientError.BAD_REQUEST, constants_1.errorMessages.STATIC_PAGE_SLUG_INVALID);
        }
        const staticPage = yield exports.staticPageService.getStaticPageBySlug(staticPageSlug);
        if (!staticPage) {
            throw (0, http_errors_1.default)(constants_1.statusCodes.clientError.BAD_REQUEST, constants_1.errorMessages.STATIC_PAGE_SLUG_INVALID);
        }
        if (!content) {
            throw (0, http_errors_1.default)(constants_1.statusCodes.clientError.BAD_REQUEST, constants_1.errorMessages.STATIC_PAGE_ELEMENT_CONTENT_INVALID);
        }
        if (!title) {
            throw (0, http_errors_1.default)(constants_1.statusCodes.clientError.BAD_REQUEST, constants_1.errorMessages.STATIC_PAGE_ELEMENT_TITLE_INVALID);
        }
        return yield database_1.prismaClient.staticPageElement.create({
            data: { staticPageId: staticPage.id, title, content },
        });
    }),
    getStaticPageById: (staticPageId) => __awaiter(void 0, void 0, void 0, function* () {
        if (!staticPageId) {
            throw (0, http_errors_1.default)(constants_1.statusCodes.clientError.BAD_REQUEST, constants_1.errorMessages.STATIC_PAGE_ID_INVALID);
        }
        return database_1.prismaClient.staticPage.findUnique(Object.assign({ where: { id: staticPageId } }, detailedStaticPageQueryArgs));
    }),
    getStaticPageBySlug: (slug) => __awaiter(void 0, void 0, void 0, function* () {
        if (!slug) {
            throw (0, http_errors_1.default)(constants_1.statusCodes.clientError.BAD_REQUEST, constants_1.errorMessages.STATIC_PAGE_SLUG_INVALID);
        }
        return database_1.prismaClient.staticPage.findUnique(Object.assign({ where: { slug } }, detailedStaticPageQueryArgs));
    }),
    getStaticPageElement: (elementId) => __awaiter(void 0, void 0, void 0, function* () {
        if (!elementId) {
            throw (0, http_errors_1.default)(constants_1.statusCodes.clientError.BAD_REQUEST, constants_1.errorMessages.STATIC_PAGE_ELEMENT_ID_INVALID);
        }
        return yield database_1.prismaClient.staticPageElement.findUnique({ where: { id: elementId } });
    }),
    getStaticPages: () => __awaiter(void 0, void 0, void 0, function* () {
        return yield database_1.prismaClient.staticPage.findMany(detailedStaticPageQueryArgs);
    }),
    updateStaticPageElement: (elementId, title, content) => __awaiter(void 0, void 0, void 0, function* () {
        if (!elementId || !(yield exports.staticPageService.getStaticPageElement(elementId))) {
            throw (0, http_errors_1.default)(constants_1.statusCodes.clientError.BAD_REQUEST, constants_1.errorMessages.STATIC_PAGE_ELEMENT_ID_INVALID);
        }
        if (!title) {
            throw (0, http_errors_1.default)(constants_1.statusCodes.clientError.BAD_REQUEST, constants_1.errorMessages.STATIC_PAGE_ELEMENT_TITLE_INVALID);
        }
        if (!content) {
            throw (0, http_errors_1.default)(constants_1.statusCodes.clientError.BAD_REQUEST, constants_1.errorMessages.STATIC_PAGE_ELEMENT_CONTENT_INVALID);
        }
        return yield database_1.prismaClient.staticPageElement.update({ where: { id: elementId }, data: { title, content } });
    }),
    deleteStaticPageElement: (elementId) => __awaiter(void 0, void 0, void 0, function* () {
        if (!elementId || !(yield exports.staticPageService.getStaticPageElement(elementId))) {
            throw (0, http_errors_1.default)(constants_1.statusCodes.clientError.BAD_REQUEST, constants_1.errorMessages.STATIC_PAGE_ELEMENT_ID_INVALID);
        }
        return yield database_1.prismaClient.staticPageElement.delete({ where: { id: elementId } });
    }),
};
//# sourceMappingURL=static-page.service.js.map