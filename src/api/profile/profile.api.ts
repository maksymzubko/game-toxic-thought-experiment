import { AxiosResponse } from 'axios';
import agent from '../base';
import {
    CreateQuestion, CreateQuestionResponse,
    GetMineQuestionsListResponse,
    EditQuestion, EditQuestionResponse,
} from "./types";
class ProfileApi {

    async createQuestion(data: CreateQuestion): Promise<CreateQuestionResponse> {
        try {
            const response: AxiosResponse = await agent.post(
                `questions`, data
            );
            if (response.status === 200 || response.status === 201) {
                return response.data;
            }
            return undefined;
        } catch (err) {
            throw err;
        }
    }

    async getMineQuestionsList(): Promise<GetMineQuestionsListResponse[]> {
        try {
            const response: AxiosResponse = await agent.get(
                `questions/mine`,
            );
            if (response.status === 200 || response.status === 201) {
                return response.data;
            }
            return undefined;
        } catch (err) {
            throw err;
        }
    }
    async editQuestion(id: number, data: EditQuestion): Promise<EditQuestionResponse> {
        try {
            const response: AxiosResponse = await agent.put(
                `questions/${id}`, data,
            );
            if (response.status === 200 || response.status === 201) {
                return response.data;
            }
            return undefined;
        } catch (err) {
            throw err;
        }
    }
    async deleteQuestion(id: number): Promise<boolean> {
        try {
            const response: AxiosResponse = await agent.delete(
                `questions/${id}`,
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

const profilesQpi = new ProfileApi();
export default profilesQpi;
