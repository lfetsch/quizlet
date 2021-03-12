import fs = require("fs");

export interface QuestionData {
    id: number;
    text: string;
    answer: string | number;
    tags: string[]
}

export interface QuizData {
    id: number,
    name: string,
    version: string,
    questions: QuestionData[];
}

export class File {
    static read(path: string, callback: (err: NodeJS.ErrnoException | null, quizData: QuizData | null) => void): void {
        fs.readFile(path, (err, content) => {
            if (err) {
                callback(err, null);
            } else {
                const quizData: QuizData = JSON.parse(content.toString());
                callback(null, quizData);
            }
        });
    }
}
