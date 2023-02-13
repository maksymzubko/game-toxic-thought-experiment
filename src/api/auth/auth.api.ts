import { AxiosResponse } from 'axios';
import agent from '../base';
import {Login, LoginResponse, Register, RegisterResponse} from "./types";
class AuthApi {

    async login(data: Login): Promise<LoginResponse> {
        try {
            const response: AxiosResponse = await agent.post(
                `auth/login`, data
            );

            if (response.status === 200 || response.status === 201) {
                return response.data;
            }

            return undefined;
        } catch (err) {
            throw err;
        }
    }

    async register(data: Register): Promise<RegisterResponse> {
        try {
            const response: AxiosResponse = await agent.post(
                `auth/register`, data
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

const questionsQpi = new AuthApi();
export default questionsQpi;
