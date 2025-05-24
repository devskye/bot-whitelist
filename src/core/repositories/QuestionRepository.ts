
import type { Question } from '@prisma/client';
import { prisma } from 'libs/prisma.js';

export class QuestionRepository {
    async findAll(): Promise<Question[]> {
        try {
            return await prisma.question.findMany();
        } catch (err) {
            console.error('Error fetching questions:', err);
            return [];
        }
    }

    async findById(id: number): Promise<Question | null> {
        try {
            return await prisma.question.findUnique({
                where: { id }
            });
        } catch (err) {
            console.error('Error fetching question by id:', err);
            throw new Error("Failed to get question");
        }
    }

    async create(question: string): Promise<Question> {
        try {
            return await prisma.question.create({
                data: { question }
            });
        } catch (err) {
            console.error('Error creating question:', err);
            throw err;
        }
    }

    async update(id: number, question: string): Promise<Question> {
        try {
            return await prisma.question.update({
                where: { id },
                data: { question }
            });
        } catch (err) {
            console.error('Error updating question:', err);
            throw err;
        }
    }

    async delete(id: number): Promise<Question> {
        try {
            return await prisma.question.delete({
                where: { id }
            });
        } catch (err) {
            console.error('Error deleting question:', err);
            throw err;
        }
    }
}