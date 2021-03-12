import * as nconf from "nconf";
import { Quiz } from "./quiz";
import { Question } from "./question";
import {File, QuizData} from "./file";
import yargs = require("yargs");

export class App {
    private static config = nconf.env().argv().file("config", "config.json");

    static main(args: string[]): void {

        const argv = yargs
            .option("file", {
                alias: "f",
                description: "File that contains the questions",
                type: "string"
            })
            .option("tags", {
                alias: "t",
                description: "Filter questions for a set of tags",
                type: "array"
            })
            .option("samples", {
                alias: "s",
                description: "Take a sample from the question set",
                type: "number"
            })
            .demandOption(["file"])
            .example([
                ["$0", "Run through all questions"],
                ["$0 --file \"./data/questions.json\" --samples 3", "Take a sample of three questions"],
                ["$0 --file \"./data/questions.json\" --tags port osi", "Use questions tagged with \"port\" or \"osi\""],
                ["$0 --file \"./data/questions.json\" --tags port --samples 3", "Take a sample of three questions that are tagged with \"port\""]
            ])
            .help()
            .alias("help", "h")
            .parse(args);

        // Load the data
        File.read(argv.file, (err, quizData: QuizData) => {
            if (err) {
                throw err;
            }

            // Load questions from the data file
            const questions: Question[] = [];
            quizData.questions.forEach((item) => {
                questions.push(new Question(item.id, item.text, item.answer, item.tags));
            });

            // Create a quiz
            process.stdout.write(`${quizData.name}, version ${quizData.version}\n\n`);

            new Quiz(quizData.name, questions)
                .samples(argv.samples || questions.length)
                .tags((argv.tags || []).map((element) => element.toString()))
                .run(() => {
                    // Summarize the results
                    const attempted = questions.filter((question) => question.response);
                    const totalCount = attempted.length;
                    if (totalCount > 0) {
                        // Report raw score
                        const correctCount = attempted.filter((question) => question.isCorrect).length;
                        const correctPercent = Math.round(correctCount / totalCount * 100.0);
                        process.stdout.write(`\nScore is ${correctCount}/${totalCount}: ${correctPercent}%\n\n`);

                        // TODO: report scores grouped by tags

                        // Report incorrect responses
                        attempted.filter((question) => !question.isCorrect).forEach((question) => {
                            process.stdout.write(`[x] ${question.text} ${question.response} (${question.answer})\n`);
                        });
                    } else {
                        process.stdout.write("No questions were found.");
                    }
                });
        });
    }
}

App.main(process.argv);