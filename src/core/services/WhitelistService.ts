import type { Question, Whitelist, Answer, Prisma } from '@prisma/client';
import { AnswerRepository } from 'core/repositories/AnswerRepository.js';
import { QuestionRepository } from 'core/repositories/QuestionRepository.js';
import { WhitelistRepository } from 'core/repositories/WhitelistRepository.js';
import { UserWhitelist } from 'core/userWhitelist.js';



export class WhitelistService {
    private questionRepository: QuestionRepository;
    private whitelistRepository: WhitelistRepository;
    private answerRepository: AnswerRepository;

    constructor() {
        this.questionRepository = new QuestionRepository();
        this.whitelistRepository = new WhitelistRepository();
        this.answerRepository = new AnswerRepository();
    }

    // Question Services
    async getAllQuestions(): Promise<Question[]> {
        return await this.questionRepository.findAll();
    }

    async getQuestionById(id: number): Promise<Question> {
        const question = await this.questionRepository.findById(id);
        if (!question) {
            throw new Error("Question not found");
        }
        return question;
    }

    async createQuestion(questionText: string): Promise<Question> {
        return await this.questionRepository.create(questionText);
    }

    async updateQuestion(id: number, questionText: string): Promise<Question> {
        return await this.questionRepository.update(id, questionText);
    }

    async deleteQuestion(id: number): Promise<Question> {
        return await this.questionRepository.delete(id);
    }

    // Whitelist Services
    async getAllWhitelists(): Promise<Whitelist[]> {
        return await this.whitelistRepository.findAll();
    }

    async getWhitelistByUserId(userid: string): Promise<Whitelist | null> {
        return await this.whitelistRepository.findByUserId(userid);
    }

    async createWhitelist(data: Prisma.WhitelistCreateInput): Promise<Whitelist> {
        return await this.whitelistRepository.create(data);
    }

    async updateWhitelist(id: number, data: Partial<Whitelist>): Promise<Whitelist> {
        return await this.whitelistRepository.update(id, data);
    }

    async deleteWhitelistById(id: number): Promise<void> {
        await this.whitelistRepository.delete(id);
    }

    async deleteWhitelistByUserId(userid: string): Promise<void> {
        await this.whitelistRepository.deleteByUserId(userid);
    }

    // Answer Services
    async getAnswersByWhitelistUserId(userid: string): Promise<Answer[]> {
        return await this.answerRepository.findByWhitelistUserId(userid);
    }

    async deleteAnswersByWhitelistId(whitelistid: number): Promise<void> {
        await this.answerRepository.deleteByWhitelistId(whitelistid);
    }

    async deleteAnswersByWhitelistUserId(userid: string): Promise<void> {
        await this.answerRepository.deleteByWhitelistUserId(userid);
    }

    // Complex Business Logic
    async initializeWhitelistData(): Promise<{ questions: Question[], whitelists: Map<string, UserWhitelist> }> {
        try {
            const questions = await this.getAllQuestions();
            const whitelistsData = await this.getAllWhitelists();
            
            const whitelists = new Map<string, UserWhitelist>();
            whitelistsData.forEach((whitelist: Whitelist) => {
                const userwhitelist = new UserWhitelist(whitelist);
                whitelists.set(whitelist.userId, userwhitelist);
            });

            return { questions, whitelists };
        } catch (error) {
            console.error('Error initializing whitelist data:', error);
            return { questions: [], whitelists: new Map() };
        }
    }

    async cleanupWhitelistData(userid: string): Promise<void> {
        try {
            await this.deleteAnswersByWhitelistUserId(userid);
            await this.deleteWhitelistByUserId(userid);
            console.log(`[WHITELIST SERVICE] Cleaned up data for user ${userid}`);
        } catch (error) {
            console.error(`Error cleaning up whitelist data for user ${userid}:`, error);
            throw error;
        }
    }

    async finalizeWhitelist(userid: string): Promise<{ answers: Answer[], questions: Question[] }> {
        try {
            const answers = await this.getAnswersByWhitelistUserId(userid);
            const questions = await this.getAllQuestions();
            
            return { answers, questions };
        } catch (error) {
            console.error('Error finalizing whitelist:', error);
            throw error;
        }
    }

    async validateWhitelistExists(userId: string): Promise<boolean> {
        const whitelist = await this.getWhitelistByUserId(userId);
        return whitelist !== null;
    }

    async isWhitelistStarted(userId: string): Promise<boolean> {
        const whitelist = await this.getWhitelistByUserId(userId);
        return whitelist?.started ?? false;
    }
}