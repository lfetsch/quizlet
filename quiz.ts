import readline = require("readline");
import { AnswerLike, Question } from "./question";

export class Quiz {
    name: string;
    rl: readline.Interface;
    questions: Question[];
    sampleCount: number;
    filterTags: string[];

    constructor(name: string, questions: Question[]) {
        this.name = name || "Quiz";
        this.questions = questions || [];
        this.sampleCount = this.questions.length;
        this.filterTags = [];
        this.rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
    }

    samples(count: number): Quiz {
        if (count !== null && count !== undefined) {
            if (count > 0) {
                this.sampleCount = Math.min(count, this.questions.length);
            } else {
                throw new RangeError("The 'count' must be a positive value");
            }
        }
        return this;
    }

    tags(tags: string[]): Quiz {
        this.filterTags = tags || [];
        return this;
    }

    randomizeQuestions(): number[] {
        // Start with a subset of questions based on tags
        const questions = this.questions.filter((question) => {
            return this.filterTags.length === 0 ||
                question.tags.some((element) => this.filterTags.includes(element));
        });

        // Create a range based on the number of questions ([0,1,2,3])
        const range = Array(questions.length).fill(0).map((item, index) => index);

        // Shuffle the array ([2,3,0,1])
        const shuffled = range.map(a => [Math.random(), a]).sort((a, b) => a[0] - b[0]).map(a => a[1]);

        // Take a sample
        return shuffled.slice(0, this.sampleCount);
    }

    prompt(question: string, answer: AnswerLike, callback: (response: string, isCorrect: boolean) => void): void {
        this.rl.question(`${question} `, (response) => {
            callback(response, response.toLowerCase() === answer.toString().toLowerCase());
        });
    }

    nextQuestion(questionSet: number[], callback: () => void): void {
        // Continue prompting until there are no more questions in the set
        if (questionSet.length > 0) {
            // Remove the next question from the set
            const index = questionSet.pop();
            const question = this.questions[index];
            this.prompt(question.text, question.answer, (response, isCorrect) => {
                // Capture the response and then continue to the next question
                question.response = response;
                question.isCorrect = isCorrect;
                this.nextQuestion(questionSet, callback);
            });
        } else {
            callback();
        }
    }

    run(callback: () => void): void {
        const questionSet = this.randomizeQuestions();
        this.nextQuestion(questionSet, () => {
            this.rl.close();
            callback();
        });
    }
}