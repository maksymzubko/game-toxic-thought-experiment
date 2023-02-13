export interface SendVote {
    question_id: number,
    vote_type: "like" | "dislike" | "report"
}

export interface Vote {
    id: number,
    questionsid: number,
    userid: number,
    variant: "like" | "dislike" | "report",
    date: number
}