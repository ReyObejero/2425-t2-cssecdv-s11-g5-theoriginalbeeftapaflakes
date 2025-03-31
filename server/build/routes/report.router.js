"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reportRouter = void 0;
const express_1 = require("express");
const controllers_1 = require("../controllers");
const middlewares_1 = require("../middlewares");
const validations_1 = require("../validations");
const reportRouter = (0, express_1.Router)();
exports.reportRouter = reportRouter;
reportRouter.get('/sales', middlewares_1.authenticate, middlewares_1.protect, (0, middlewares_1.validate)(validations_1.getSalesSchema), controllers_1.reportController.getSales);
//# sourceMappingURL=report.router.js.map