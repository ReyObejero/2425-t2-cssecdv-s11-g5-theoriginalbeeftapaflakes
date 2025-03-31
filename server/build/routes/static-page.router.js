"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.staticPageRouter = void 0;
const express_1 = require("express");
const controllers_1 = require("../controllers");
const middlewares_1 = require("../middlewares");
const staticPageRouter = (0, express_1.Router)();
exports.staticPageRouter = staticPageRouter;
staticPageRouter.post('/', middlewares_1.authenticate, middlewares_1.protect, controllers_1.staticPageController.createStaticPage);
staticPageRouter.post('/:staticPageSlug', middlewares_1.authenticate, middlewares_1.protect, controllers_1.staticPageController.createStaticPageElement);
staticPageRouter.get('/', middlewares_1.authenticate, middlewares_1.protect, controllers_1.staticPageController.getStaticPages);
staticPageRouter.get('/:staticPageSlug', middlewares_1.authenticate, middlewares_1.protect, controllers_1.staticPageController.getStaticPage);
staticPageRouter.put('/:staticPageSlug/:staticPageElementId', middlewares_1.authenticate, middlewares_1.protect, controllers_1.staticPageController.updateStaticPageElement);
staticPageRouter.delete('/:staticPageSlug/:staticPageElementId', middlewares_1.authenticate, middlewares_1.protect, controllers_1.staticPageController.deleteStaticPageElement);
//# sourceMappingURL=static-page.router.js.map