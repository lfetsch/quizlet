export type AnswerLike = string | number;

export class Question {
    id: number;
    text: string;
    answer: AnswerLike;
    tags: string[];
    response: string;
    isCorrect: boolean;

    constructor(id: number, text: string, answer: AnswerLike, tags: string[]) {
        this.id = id;
        this.text = text;
        this.answer = answer;
        this.tags = tags;
        this.response = null;
        this.isCorrect = false;
    }
}