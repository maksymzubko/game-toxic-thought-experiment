export interface Question {
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