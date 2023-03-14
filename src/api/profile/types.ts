export interface CreateQuestion {
    question: string,
    answers: string[],
    language: 'en' | 'jp' | null,
}

export interface CreateQuestionResponse {
    question: string,
    answers: string[],
    dateOfCreation: number,
    language: 'en' | 'jp' | null,
    ownerId: number,
}

export interface GetMineQuestionsListResponse {
    question: string,
    answers: any[],
    dateOfCreation: number,
    language: 'en' | 'jp' | null,
    ownerId: number,
}

export interface EditQuestion {
    question: string,
    answers: string[],
    language: 'en' | 'jp' | null,
}

export interface EditQuestionResponse {
    question: string,
    answers: string[],
    dateOfCreation: number,
    language: 'en' | 'jp' | null,
    ownerId: number,
}
