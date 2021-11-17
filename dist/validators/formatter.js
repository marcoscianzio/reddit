"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.format = void 0;
const format = (err) => {
    const errors = [];
    err.inner.forEach((e) => {
        errors.push({
            path: e.path,
            message: e.message,
        });
    });
    return { errors };
};
exports.format = format;
//# sourceMappingURL=formatter.js.map