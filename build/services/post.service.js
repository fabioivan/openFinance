"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostService = void 0;
var PostService = /** @class */ (function () {
    function PostService() {
        this.index = function () {
            return 'Index from Service';
        };
        this.create = function () {
            return 'Create from Service';
        };
        this.update = function () {
            return 'Update from Service';
        };
        this.delete = function () {
            return 'Delete from Service';
        };
    }
    return PostService;
}());
exports.PostService = PostService;
