# Quizlet

Quizlet is a simple flashcard console application.

It reads in a list of questions, randomizes the order in which
the questions are presented, and provides options to filter
questions.

## Install

Clone the repository and then:

```
npm install
npm run build
```

## Getting Started

To run the sample questions:

```
npm run start -- --file "./data/questions.json"
```

For the command line options:

```
npm run start -- --help
```

Upon completion, a report is displayed along with any incorrect
responses.

```
❯ npm run start -- --file "./data/questions.json" --samples 5

> quizlet@0.0.1 start C:\Users\larry\source\personal\quizlet
> node ./dist/app.js "--file" "./data/questions.json" "--samples" "5"

Sample Flashcards, version 1

What is OSI Layer 3? network
Default port for SMTP? 999
What is OSI Layer 2? data link
What is OSI Layer 1? physical
Default port for SSH? 22

Score is 4/5: 80%

[x] Default port for SMTP? 999 (25)
```

