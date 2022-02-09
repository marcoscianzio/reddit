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
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostResolver = void 0;
const post_1 = require("../entities/post");
const type_graphql_1 = require("type-graphql");
const isAuth_1 = require("../middlewares/isAuth");
const typeorm_1 = require("typeorm");
const updoot_1 = require("../entities/updoot");
let PostInput = class PostInput {
};
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], PostInput.prototype, "title", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], PostInput.prototype, "content", void 0);
PostInput = __decorate([
    (0, type_graphql_1.InputType)()
], PostInput);
let PaginatedPosts = class PaginatedPosts {
};
__decorate([
    (0, type_graphql_1.Field)(() => [post_1.Post]),
    __metadata("design:type", Array)
], PaginatedPosts.prototype, "posts", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", Boolean)
], PaginatedPosts.prototype, "hasMore", void 0);
PaginatedPosts = __decorate([
    (0, type_graphql_1.ObjectType)()
], PaginatedPosts);
let PostResolver = class PostResolver {
    textSnippet(root) {
        return root.content.slice(0, 50);
    }
    async vote(postId, value, { req }) {
        const { userId } = req.session;
        const isUpdoot = value !== -1;
        const realValue = isUpdoot ? 1 : -1;
        const updoot = await updoot_1.Updoot.findOne({ postId, userId });
        if (updoot && updoot.value !== realValue) {
            await (0, typeorm_1.getConnection)()
                .getRepository(updoot_1.Updoot)
                .createQueryBuilder("updoot")
                .update(updoot_1.Updoot)
                .set({
                value: realValue,
            })
                .where("postId = :postId", { postId })
                .execute();
            await (0, typeorm_1.getConnection)()
                .getRepository(post_1.Post)
                .createQueryBuilder("post")
                .update(post_1.Post)
                .set({
                points: () => `points + ${realValue * 2}`,
            })
                .where("id = :postId", { postId })
                .execute();
        }
        else if (!updoot) {
            await updoot_1.Updoot.insert({
                userId,
                postId,
                value: realValue,
            });
            await (0, typeorm_1.getConnection)()
                .getRepository(post_1.Post)
                .createQueryBuilder("post")
                .update(post_1.Post)
                .set({
                points: () => `points + ${realValue}`,
            })
                .where("id = :postId", { postId })
                .execute();
        }
        return true;
    }
    async posts(limit, cursor) {
        const realLimit = Math.min(50, limit);
        const realLimitPlusOne = realLimit + 1;
        const query = (0, typeorm_1.getConnection)()
            .getRepository(post_1.Post)
            .createQueryBuilder("post")
            .innerJoinAndSelect("post.author", "user", "user.id = post.authorId")
            .orderBy("post.created_at", "DESC")
            .take(realLimitPlusOne);
        if (cursor) {
            query.where("post.created_at < :cursor", {
                cursor: new Date(parseInt(cursor)),
            });
        }
        const posts = await query.getMany();
        return {
            posts: posts.slice(0, realLimit),
            hasMore: posts.length == realLimitPlusOne,
        };
    }
    async post(id) {
        return await post_1.Post.findOne({ id });
    }
    async createPost(values, { req }) {
        const post = await post_1.Post.create(Object.assign(Object.assign({}, values), { authorId: req.session.userId })).save();
        return post;
    }
    async updatePost(id, title) {
        const post = await post_1.Post.findOne({ id });
        if (!post) {
            return undefined;
        }
        await post_1.Post.update({ id }, { title });
        const updatedPost = await post_1.Post.findOne({ id });
        return updatedPost;
    }
    async deletePost(id) {
        const post = await post_1.Post.findOne({ id });
        if (!post) {
            return false;
        }
        await post_1.Post.delete({ id });
        return true;
    }
};
__decorate([
    (0, type_graphql_1.FieldResolver)(() => String),
    __param(0, (0, type_graphql_1.Root)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [post_1.Post]),
    __metadata("design:returntype", void 0)
], PostResolver.prototype, "textSnippet", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => Boolean),
    (0, type_graphql_1.UseMiddleware)(isAuth_1.isAuth),
    __param(0, (0, type_graphql_1.Arg)("postId", () => type_graphql_1.Int)),
    __param(1, (0, type_graphql_1.Arg)("value", () => type_graphql_1.Int)),
    __param(2, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, Object]),
    __metadata("design:returntype", Promise)
], PostResolver.prototype, "vote", null);
__decorate([
    (0, type_graphql_1.Query)(() => PaginatedPosts),
    __param(0, (0, type_graphql_1.Arg)("limit", () => type_graphql_1.Int)),
    __param(1, (0, type_graphql_1.Arg)("cursor", () => String, { nullable: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], PostResolver.prototype, "posts", null);
__decorate([
    (0, type_graphql_1.Query)(() => post_1.Post, { nullable: true }),
    __param(0, (0, type_graphql_1.Arg)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], PostResolver.prototype, "post", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => post_1.Post),
    (0, type_graphql_1.UseMiddleware)(isAuth_1.isAuth),
    __param(0, (0, type_graphql_1.Arg)("values")),
    __param(1, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [PostInput, Object]),
    __metadata("design:returntype", Promise)
], PostResolver.prototype, "createPost", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => post_1.Post, { nullable: true }),
    (0, type_graphql_1.UseMiddleware)(isAuth_1.isAuth),
    __param(0, (0, type_graphql_1.Arg)("id")),
    __param(1, (0, type_graphql_1.Arg)("title", () => String, { nullable: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String]),
    __metadata("design:returntype", Promise)
], PostResolver.prototype, "updatePost", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => Boolean),
    (0, type_graphql_1.UseMiddleware)(isAuth_1.isAuth),
    __param(0, (0, type_graphql_1.Arg)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], PostResolver.prototype, "deletePost", null);
PostResolver = __decorate([
    (0, type_graphql_1.Resolver)(post_1.Post)
], PostResolver);
exports.PostResolver = PostResolver;
//# sourceMappingURL=post.js.map