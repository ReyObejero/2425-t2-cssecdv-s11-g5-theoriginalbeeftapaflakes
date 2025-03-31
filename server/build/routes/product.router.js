"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.productRouter = void 0;
const express_1 = require("express");
const controllers_1 = require("../controllers");
const middlewares_1 = require("../middlewares");
const validations_1 = require("../validations");
const productRouter = (0, express_1.Router)();
exports.productRouter = productRouter;
productRouter.get('/', controllers_1.productController.getProducts);
productRouter.get('/:productId', (0, middlewares_1.validate)(validations_1.getProductByIdSchema), controllers_1.productController.getProduct);
productRouter.delete('/:productId/:packageId', middlewares_1.authenticate, middlewares_1.protect, (0, middlewares_1.validate)(validations_1.deletePackageSchema), controllers_1.productController.deletePackage);
//# sourceMappingURL=product.router.js.map