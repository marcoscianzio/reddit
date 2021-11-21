"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserResolver = void 0;
const user_1 = require("../entities/user");
const user_2 = require("../inputs/user");
const type_graphql_1 = require("type-graphql");
const argon2_1 = __importDefault(require("argon2"));
const user_3 = require("../validators/user");
const formatter_1 = require("../validators/formatter");
let PathError = class PathError {
};
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], PathError.prototype, "path", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], PathError.prototype, "message", void 0);
PathError = __decorate([
    (0, type_graphql_1.ObjectType)()
], PathError);
let UserResponse = class UserResponse {
};
__decorate([
    (0, type_graphql_1.Field)(() => [PathError], { nullable: true }),
    __metadata("design:type", Array)
], UserResponse.prototype, "errors", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => user_1.User, { nullable: true }),
    __metadata("design:type", user_1.User)
], UserResponse.prototype, "user", void 0);
UserResponse = __decorate([
    (0, type_graphql_1.ObjectType)()
], UserResponse);
let UserResolver = class UserResolver {
    async Me({ req }) {
        if (!req.session.userId) {
            return undefined;
        }
        else {
            const user = await user_1.User.findOne(req.session.userId);
            return user;
        }
    }
    async register(options, { req }) {
        try {
            console.log("a");
            await user_3.userSchema.validate(options, { abortEarly: false });
        }
        catch (error) {
            return (0, formatter_1.format)(error);
        }
        const userAlreadyExist = await user_1.User.findOne({ username: options.username });
        if (userAlreadyExist) {
            return {
                errors: [
                    {
                        path: "username",
                        message: "Username already exists",
                    },
                ],
            };
        }
        const hashedPassword = await argon2_1.default.hash(options.password);
        const user = await user_1.User.create({
            username: options.username,
            password: hashedPassword,
        }).save();
        req.session.userId = user.id;
        return { user };
    }
    async login(options, { req }) {
        const user = await user_1.User.findOne({ username: options.username });
        if (!user) {
            return {
                errors: [
                    {
                        path: "username",
                        message: "Username incorrect",
                    },
                ],
            };
        }
        const valid = await argon2_1.default.verify(user.password, options.password);
        if (!valid) {
            return {
                errors: [
                    {
                        path: "password",
                        message: "Password incorrect",
                    },
                ],
            };
        }
        req.session.userId = user.id;
        return { user };
    }
};
__decorate([
    (0, type_graphql_1.Query)(() => user_1.User, { nullable: true }),
    __param(0, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "Me", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => UserResponse),
    __param(0, (0, type_graphql_1.Arg)("options")),
    __param(1, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_2.UsernamePassword, Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "register", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => UserResponse),
    __param(0, (0, type_graphql_1.Arg)("options")),
    __param(1, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_2.UsernamePassword, Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "login", null);
UserResolver = __decorate([
    (0, type_graphql_1.Resolver)()
], UserResolver);
exports.UserResolver = UserResolver;
//# sourceMappingURL=user.js.map