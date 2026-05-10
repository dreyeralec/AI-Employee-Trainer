"use server";

import { uploadSurvey, uploadScores } from "@/lib/bucketUtil";
import { Question, Scores } from "@/lib/types";

//using server actions to ensure no credentials are ever seen by the browser

//server action for calling function to upload a survey to the GCS Bucket
export async function createSurvey(surveyName: string, questions: Question[]) {
    //function being called from the survey action
    uploadSurvey(surveyName, questions);
}

//server action for calling function to upload the scores to the GCS Bucket
export async function saveScores(scores: Scores) {
    //function being called from the survey action
    uploadScores(scores);
}