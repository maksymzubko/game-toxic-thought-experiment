import axios, { AxiosRequestConfig } from 'axios';

const agent = axios.create({
  baseURL: process.env.VITE_API
});

agent.interceptors.request.use(
  async (config: any) => {
    const token = localStorage.getItem('18plus_token');
    if (token) {
        try{
            const data = JSON.parse(token);
            config.headers!.Authorization = `Bearer ${data.access_token.toString()}`;
        }
        catch (e){
            localStorage.removeItem('18plus_token');
        }
    }

    config.headers!['Access-Control-Allow-Origin'] = '*';
    return config;
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error);
  }
);

agent.interceptors.response.use(
  function (response) {
    return response;
  },
  function (error) {
    if (error.response.status === 401) {
      localStorage.removeItem('18plus_token');
    }
    return Promise.reject(error);
  }
);

export default agent;
