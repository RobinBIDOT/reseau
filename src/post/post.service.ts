import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePostDto } from './dto/createPost.dto';
import { UpdatePostDto } from './dto/updatePost.dto';

@Injectable()
export class PostService {
    constructor(private readonly prismaService: PrismaService) {}

    async getAll() {
        return this.prismaService.post.findMany({
            include: {
                user: {
                    select: {
                        username: true,
                        email: true,
                    }
                },
                comments: {
                    include: {
                        user: {
                            select: {
                                username: true,
                                email: true,
                            }
                        }
                    }
                }
            }
        });
    }

    async create(createPostDto: CreatePostDto, userId: number) {
        const { body, title } = createPostDto;
        await this.prismaService.post.create({ data: { body, title, userId } });
        return { data: 'Post created' };
    }

    async delete(postId: number, userId: number) {
        const post = await this.prismaService.post.findUnique({ where: { postId } });
        if (!post) throw new NotFoundException('Post not found');
        if (post.userId !== userId) throw new ForbiddenException('Forbidden action');
        await this.prismaService.post.delete({ where: { postId } });
        return { data: 'Post deleted' };
    }

    async update(postId: number, userId: number, updatePostDto: UpdatePostDto) {
        const post = await this.prismaService.post.findUnique({ where: { postId } });
        if (!post) throw new NotFoundException('Post not found');
        if (post.userId !== userId) throw new ForbiddenException('Forbidden action');
        await this.prismaService.post.update({ where: { postId }, data: updatePostDto });
        return { data: 'Post updated' };
    }

    async getPostById(postId: number) {
        return this.prismaService.post.findUnique({
            where: { postId },
            include: {
                user: true,
                comments: {
                    include: {
                        user: true,
                    },
                },
            },
        });
    }

    async getUserPosts(userId: number) {
        return this.prismaService.post.findMany({
            where: { userId },
            include: {
                comments: true,
            },
        });
    }
}
