export interface SendVote {
    question_id: number,
    vote_type: "like" | "dislike" | "report"
}

export interface Vote {
    id: number,
    questionId: number,
    userId: number,
    variant: "like" | "dislike" | "report",
    date: number
}