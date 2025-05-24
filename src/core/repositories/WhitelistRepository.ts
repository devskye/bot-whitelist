
import type { Prisma, Whitelist } from '@prisma/client';
import { prisma } from 'libs/prisma.js';

export class WhitelistRepository {
    async findAll(): Promise<Whitelist[]> {
        try {
            return await prisma.whitelist.findMany();
        } catch (err) {
            console.error('Error fetching whitelists:', err);
            return [];
        }
    }

    async findByUserId(userId: string): Promise<Whitelist | null> {
        try {
            return await prisma.whitelist.findUnique({
                where: { userId }
            });
        } catch (err) {
            console.error('Error fetching whitelist by userid:', err);
            return null;
        }
    }

    async create(data: Prisma.WhitelistCreateInput): Promise<Whitelist> {
        try {
            return await prisma.whitelist.create({
                data
            });
        } catch (err) {
            console.error('Error creating whitelist:', err);
            throw err;
        }
    }

    async update(id: number, data: Prisma.WhitelistUpdateInput): Promise<Whitelist> {
        try {
            return await prisma.whitelist.update({
                where: { id },
                data
            });
        } catch (err) {
            console.error('Error updating whitelist:', err);
            throw err;
        }
    }

    async delete(id: number): Promise<void> {
        try {
            await prisma.whitelist.delete({
                where: { id }
            });
        } catch (err) {
            console.error('Error deleting whitelist:', err);
            throw err;
        }
    }

    async deleteByUserId(userId: string): Promise<void> {
        try {
            await prisma.whitelist.delete({
                where: { userId }
            });
        } catch (err) {
            console.error('Error deleting whitelist by userid:', err);
            throw err;
        }
    }
    async updateFirstQuestion(id: number, content: string, questionId: number): Promise<Whitelist> {
        try {
            return await prisma.whitelist.update({
                where: { id },
                data: {
                    lastquestion: 0,
                    started: true,
                    answers: {
                        create: { questionId, answer: content }
                    }
                }
            });
        } catch (err) {
            console.error('Error updating first question:', err);
            throw err;
        }
    }
    

    async updateNextQuestion(id: number, lastQuestion: number, content: string, questionId: number) {
        try {
            return await prisma.whitelist.update({
                where: { id },
                data: {
                    lastquestion: lastQuestion + 1,
                    answers: {
                        create: { questionId, answer: content }
                    }
                }
            });
        } catch (err) {
            console.error('Error updating next question in whitelist:', err);
            throw err;
        }
    }
    
    async deleteAnswers(whitelistId: number) {
        try {
            return await prisma.answer.deleteMany({
                where: { whitelistId: whitelistId }
            });
        } catch (err) {
            console.error('Error deleting whitelist answers:', err);
            throw err;
        }
    }
    
    async deleteWhitelist(id: number) {
        try {
            return await prisma.whitelist.delete({
                where: { id }
            });
        } catch (err) {
            console.error('Error deleting whitelist:', err);
            throw err;
        }
    }
    
    async approveWhitelist(id: number) {
        try {
            return await prisma.whitelist.update({
                where: { id },
                data: {
                    approved: true,
                    started: false
                }
            });
        } catch (err) {
            console.error('Error approving whitelist:', err);
            throw err;
        }
    }

}
