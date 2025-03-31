"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRouter = void 0;
const express_1 = require("express");
const controllers_1 = require("../controllers");
const middlewares_1 = require("../middlewares");
const validations_1 = require("../validations");
const authRouter = (0, express_1.Router)();
exports.authRouter = authRouter;
authRouter.post('/login', (0, middlewares_1.validate)(validations_1.loginSchema), controllers_1.authController.login);
authRouter.post('/register', (0, middlewares_1.validate)(validations_1.registerSchema), controllers_1.authController.register);
authRouter.post('/register/admin', middlewares_1.authenticate, middlewares_1.protect, (0, middlewares_1.validate)(validations_1.registerSchema), controllers_1.authController.register);
authRouter.delete('/logout', middlewares_1.authenticate, controllers_1.authController.logout);
//# sourceMappingURL=auth.router.js.map