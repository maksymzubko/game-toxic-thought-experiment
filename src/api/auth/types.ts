export interface Login {
    username: string,
    password: string
}

export interface Register {
    username: string,
    email?: string,
    password: string
}

export interface RegisterResponse {
    username: string,
    password: string,
    email: string,
    dateOfRegistration: number,
    isBanned: boolean
}

export interface LoginResponse {
    id: number,
    username: string,
    isBanned: boolean,
    access_token: string
}

