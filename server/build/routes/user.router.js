"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRouter = void 0;
const express_1 = require("express");
const controllers_1 = require("../controllers");
const middlewares_1 = require("../middlewares");
const userRouter = (0, express_1.Router)();
exports.userRouter = userRouter;
userRouter.get('/', controllers_1.userController.getUsers);
userRouter.get('/me', middlewares_1.authenticate, controllers_1.userController.getAuthenticatedUser);
userRouter.get('/:username', controllers_1.userController.getUser);
userRouter.put('/:username', middlewares_1.authenticate, controllers_1.userController.updateUser);
//# sourceMappingURL=user.router.js.map