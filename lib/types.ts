import { Part } from "@google-cloud/vertexai";

//chat type
export type Chat = {
    role: "user" | "model" | "system";
    parts: Part[];
}

//survey type
export type Survey = {
    formid: string;
    formName: string;
    questions: Question[];
}

//question type
export type Question = {
    text: string;
    expectedConcepts: string[];
    criticalMistakes: string[];
}

//new question type for building new questions in survey builder
export type NewQuestion = Question & {
    id: number;
}

//arguments for sending to the QuestionCard component
export type QuestionCardProps = {
    question: NewQuestion;
    index: number;
    onUpdate: (id: number, field: keyof Question, value: string) => void;
    onRemove: (id: number) => void;
    onAddTag: (id: number, field: ArrayField, value: string) => void;
    onRemoveTag: (id: number, field: ArrayField, idx: number) => void;
}

//array field type
export type ArrayField = "expectedConcepts" | "criticalMistakes";

//type for saving scores
export type Scores = {
    survey_name: String;
    employee_name: String;
    timestamp: String;
    metrics: [
        {
            depthOfSubjectKnowledge: number;
            gradeReasoning: string;
        },
        {
            politenessEmpathy: number;
            gradeReasoning: string;
        },
        {
            clarityConciseness: number;
            gradeReasoning: string;
        },
        {
            problemSolvingHelpfullness: number;
            gradeReasoning: string;
        },
        {
            proactiveness: number;
            gradeReasoning: string;
        },
    ];
    summary: String;
}