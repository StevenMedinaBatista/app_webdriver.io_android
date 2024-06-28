"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const utils_1 = require("../../utils");
async function savePDF(filepath, options) {
    if (typeof filepath != 'string' || !filepath.endsWith('.pdf')) {
        throw new Error('savePDF expects a filepath of type string and ".pdf" file ending');
    }
    const absoluteFilepath = utils_1.getAbsoluteFilepath(filepath);
    utils_1.assertDirectoryExists(absoluteFilepath);
    const pdf = await this.printPage(options === null || options === void 0 ? void 0 : options.orientation, options === null || options === void 0 ? void 0 : options.scale, options === null || options === void 0 ? void 0 : options.background, options === null || options === void 0 ? void 0 : options.width, options === null || options === void 0 ? void 0 : options.height, options === null || options === void 0 ? void 0 : options.top, options === null || options === void 0 ? void 0 : options.bottom, options === null || options === void 0 ? void 0 : options.left, options === null || options === void 0 ? void 0 : options.right, options === null || options === void 0 ? void 0 : options.shrinkToFit, options === null || options === void 0 ? void 0 : options.pageRanges);
    const page = Buffer.from(pdf, 'base64');
    fs_1.default.writeFileSync(absoluteFilepath, page);
    return page;
}
exports.default = savePDF;
