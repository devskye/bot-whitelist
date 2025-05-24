
import type { Answer } from '@prisma/client';
import { prisma } from 'libs/prisma.js';

export class AnswerRepository {
    async findByWhitelistUserId(userId: string): Promise<Answer[]> {
        try {
            return await prisma.answer.findMany({
                where: {
                    whitelist: { userId }
                }
            });
        } catch (err) {
            console.error('Error fetching answers by whitelist userid:', err);
            return [];
        }
    }

    async deleteByWhitelistId(whitelistId: number): Promise<void> {
        try {
            await prisma.answer.deleteMany({
                where: { whitelistId }
            });
        } catch (err) {
            console.error('Error deleting answers by whitelistid:', err);
            throw err;
        }
    }

    async deleteByWhitelistUserId(userId: string): Promise<void> {
        try {
            await prisma.answer.deleteMany({
                where: {
                    whitelist: { userId }
                }
            });
        } catch (err) {
            console.error('Error deleting answers by whitelist userid:', err);
            throw err;
        }
    }
}