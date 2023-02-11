import { AxiosResponse } from 'axios';
import agent from '../base';
import { CreateUpdateQuestion, Question} from "./types";
class QuestionsApi {

    async getAllQuestions(): Promise<Question[]> {
        try {
            const response: AxiosResponse = await agent.get(
                `questions`
            );

            if (response.status === 200 || response.status === 201) {
                return response.data;
            }

            return [];
        } catch (err) {
            throw err;
        }
    }

    async getUserQuestions(): Promise<Question[]> {
        try {
            const response: AxiosResponse = await agent.get(
                `questions/mine`
            );

            if (response.status === 200 || response.status === 201) {
                return response.data;
            }

            return [];
        } catch (err) {
            throw err;
        }
    }

    async createNewQuestion(id: number, data: CreateUpdateQuestion): Promise<Question> {
        try {
            const response: AxiosResponse = await agent.post(
                `questions/${id}`, data
            );

            if (response.status === 200 || response.status === 201) {
                return response.data;
            }

            return undefined;
        } catch (err) {
            throw err;
        }
    }

    async updateQuestion(id: number, data: CreateUpdateQuestion): Promise<Question> {
        try {
            const response: AxiosResponse = await agent.put(
                `questions/${id}`, data
            );

            if (response.status === 200 || response.status === 201) {
                return response.data;
            }

            return undefined;
        } catch (err) {
            throw err;
        }
    }

    async deleteQuestion(id: number): Promise<Question> {
        try {
            const response: AxiosResponse = await agent.delete(
                `questions/${id}`
            );

            if (response.status === 200 || response.status === 201) {
                return response.data;
            }

            return undefined;
        } catch (err) {
            throw err;
        }
    }
}

const questionsQpi = new QuestionsApi();
export default questionsQpi;
