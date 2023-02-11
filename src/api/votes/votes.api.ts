import { AxiosResponse } from 'axios';
import agent from '../base';
import {SendVote, Vote} from "./types";

class VotesApi {

    async getUserVotes(): Promise<Vote[]> {
        try {
            const response: AxiosResponse = await agent.get(
                `vote`
            );

            if (response.status === 200 || response.status === 201) {
                return response.data;
            }

            return [];
        } catch (err) {
            throw err;
        }
    }

    async vote(data: SendVote): Promise<Vote> {
        try {
            const response: AxiosResponse = await agent.post(
                `vote`, data
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

const votesApi = new VotesApi();
export default votesApi;
