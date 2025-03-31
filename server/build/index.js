"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./app");
const config_1 = require("./config");
const { PORT, HOSTNAME } = config_1.env.server;
app_1.app.listen(PORT, () => {
    console.info(`Server is running on http://${HOSTNAME}:${PORT}`);
});
//# sourceMappingURL=index.js.map