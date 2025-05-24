import fs from 'node:fs';
import type { Answer, Question } from '@prisma/client';

export class FileService {
    static createWhitelistFile(userid: string, answers: Answer[], questions: Question[]): void {
        const stream = fs.createWriteStream(`${userid}.txt`, { flags: 'a' });

        answers.forEach((answer: Answer) => {
            const question = questions.find((q: Question) => q.id === answer.questionId);
            stream.write(`Pergunta: ${question?.question}\nResposta: ${answer.answer}\n\n`);
        });

        stream.end();
    }

    static readWhitelistFile(userId: string): Buffer {
        return Buffer.from(fs.readFileSync(`${userId}.txt`));
    }

    static deleteWhitelistFile(userId: string): void {
        try {
            fs.unlinkSync(`${userId}.txt`);
        } catch (error) {
            console.error(`Error deleting file for user ${userId}:`, error);
        }
    }

    static fileExists(userId: string): boolean {
        return fs.existsSync(`${userId}.txt`);
    }
}
