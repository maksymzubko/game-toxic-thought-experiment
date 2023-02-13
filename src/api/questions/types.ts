export interface Question {
    id: number;
    question: string,
    answers: string[],
    dateOfCreation: number,
    language: string,
    ownerId: number
}

export interface CreateUpdateQuestion {
    question: string,
    answers: string[],
    language: string,
}