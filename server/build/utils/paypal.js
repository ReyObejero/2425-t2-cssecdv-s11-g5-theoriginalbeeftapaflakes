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
exports.generatePayPalAccessToken = void 0;
const config_1 = require("../config");
const generatePayPalAccessToken = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const auth = Buffer.from(`${config_1.env.paypal.CLIENT_ID}:${config_1.env.paypal.CLIENT_SECRET}`).toString('base64');
        const response = yield fetch(`${config_1.env.paypal.SANDBOX_BASE_URL}/v1/oauth2/token`, {
            method: 'POST',
            body: 'grant_type=client_credentials',
            headers: {
                Authorization: `Basic ${auth}`,
            },
        });
        return (yield response.json()).access_token;
    }
    catch (error) {
        console.error('Failed to generate Access Token: ', error);
    }
});
exports.generatePayPalAccessToken = generatePayPalAccessToken;
//# sourceMappingURL=paypal.js.map