import { Whitelist } from '@prisma/client';
import { WhitelistRepository } from './repositories/WhitelistRepository.js';

 // ajuste o caminho

export class UserWhitelist {
    data: Whitelist;
    ignore: boolean = false;
    private repo: WhitelistRepository;

    constructor(whitelist: Whitelist, repo?: WhitelistRepository) {
        this.data = whitelist;
        this.repo = repo || new WhitelistRepository();
    }

    async firstQuestion(content: string, questionId: number): Promise<void> {
        console.log('[SAVE] Salvando primeira resposta:', content);
        try {
            await this.repo.updateFirstQuestion(this.data.id, content, questionId);
            this.data = { ...this.data, lastquestion: 0, started: true }; 
            console.log(`[WHITELIST CONTROLLER] ${this.data.userId} started the whitelist!`);
        } catch (err) {
            console.error(`[WHITELIST CONTROLLER] Error starting whitelist for ${this.data.userId}`, err);
        }
    }

    async nextQuestion(content: string, questionId: number): Promise<void> {
        try {
            await this.repo.updateNextQuestion(this.data.id, this.data.lastquestion, content, questionId);
            this.data = { ...this.data, lastquestion: this.data.lastquestion + 1 };
            console.log(`[WHITELIST CONTROLLER] ${this.data.userId} answered the question!`);
        } catch (err) {
            console.error(`[WHITELIST CONTROLLER] Error answering the question for ${this.data.userId}`, err);
        }
    }

    async Delete(): Promise<void> {
        try {
            await this.repo.deleteAnswers(this.data.id);
            console.log(`[WHITELIST CONTROLLER] ${this.data.userId} deleted the questions!`);
        } catch (err) {
            console.error(`[WHITELIST CONTROLLER] Error deleting the questions for ${this.data.userId}`, err);
        }

        try {
            await this.repo.deleteWhitelist(this.data.id);
            console.log(`[WHITELIST CONTROLLER] ${this.data.userId} deleted the whitelist!`);
        } catch (err) {
            console.error(`[WHITELIST CONTROLLER] Error deleting the whitelist for ${this.data.userId}`, err);
        }
    }

    async Approve(): Promise<void> {
        try {
            await this.repo.approveWhitelist(this.data.id);
            this.data = { ...this.data, approved: true, started: false };
            console.log(`[WHITELIST CONTROLLER] ${this.data.userId} approved the whitelist!`);
        } catch (err) {
            console.error(`[WHITELIST CONTROLLER] Error approving the whitelist for ${this.data.userId}`, err);
        }
    }
}



