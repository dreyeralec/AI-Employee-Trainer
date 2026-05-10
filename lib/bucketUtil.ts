"use server";

import { Storage } from "@google-cloud/storage";
import { Scores, Survey, Question } from "./types";

//object for interacting with Google Cloud Storage
const storage = new Storage({
    projectId: process.env.GCP_PROJECT,
    credentials: JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY!)
});

//bucket name from environment file
const bucketName = process.env.BUCKET_NAME!;
//bucket we are using in Google Cloud Storage
const bucket = storage.bucket(bucketName);

//function for uploading the scores to the GCS Bucket
export async function uploadScores(scores: Scores) {
    try {
        //create a timestamp for the filename
        const timestamp = new Date();
        //build the filename, organized by the time it was created
        const filename = `responses/${timestamp.getFullYear()}/${timestamp.getMonth() + 1}/${scores.employee_name}_${scores.survey_name}_${timestamp.toISOString()}.json`;

        //build our file object
        const file = bucket.file(filename);

        //translate scores parameter to json and write to the file and save it
        await file.save(JSON.stringify(scores, null, 2), {
            contentType: "application/json",
        });
    } catch (err) {
        //catch any error and throw it
        console.log(err);
    }
}

//function for uploading a new survey from the application
export async function uploadSurvey(surveyName: string, questions: Question[]) {
    try {
        //clean the survey name for the filename
        const cleanedSurveyName = surveyName.replace(/[^a-zA-Z0-9_-]/g, "").slice(0, 255);
        //build the filename with the cleaned survey name
        const filename = `surveys/${cleanedSurveyName}.json`;
        //create a new file with the filename
        const file = bucket.file(filename);
        //generate a random formID for the new form
        const formID = crypto.randomUUID();

        //turn the user's form data into a string
        const jsonString = {
            "formid": formID,
            "formName": surveyName,
            questions,
        };

        //translate the string into json and write to the file and save it in GCS Bucket, write the generated formID to the metadata of the file
        await file.save(JSON.stringify(jsonString, null, 2), {
            contentType: "application/json",
            metadata: {
                metadata: {
                    formid: formID,
                },
            },
        });

    } catch (err) {
        //catch any error and throw it
        console.log(err);
    }
}

//fetch all the surveys in the GCS Bucket
export async function getSurveys() {
    try {
        //look in the surveys folder in the bucket
        const [files] = await bucket.getFiles({
            prefix: "surveys/",
        });

        //find all the files that end with JSON
        const jsonFiles = files.filter(file =>
            file.name.endsWith(".json")
        );

        //build the surveys array by appending all the filtered files
        const surveys: Survey[] = await Promise.all(
            jsonFiles.map(async (file) => {
                const [contents] = await file.download();
                return JSON.parse(contents.toString("utf-8")) as Survey;
            })
        );

        //return those surveys in the array
        return surveys;
    } catch (err) {
        //catch any error and return an empty array
        console.log(err);
        return [];
    }
}

//search for a specific survey in the GCS Bucket
export async function getSurvey(surveyID: string) {
    try {
        //look in the surveys folder
        const [files] = await bucket.getFiles({ prefix: "surveys/" });

        //search all the files
        for (const file of files) {
            //find the file that's metadata contains the right surveyID
            if (file.metadata.metadata?.formid === surveyID) {
                //grab that file
                const [contents] = await file.download();
                //return that file
                return JSON.parse(contents.toString("utf-8"));
            }
        };

    } catch (err) {
        //catch any error and return nothing
        console.log("Error getting survey: ", err);
    }
}

// function was used for automatically setting all the survey file's metadata to the formid
// left this in the source code for any future needs

// export async function setMetadata() {
//     try {
//         const [files] = await bucket.getFiles({ prefix: "surveys/" });

//         for (const file of files) {
//             const [contents] = await file.download();
//             const surveyString = contents.toString("utf-8").trim()

//             if (!surveyString) {
//                 console.warn(`Skipping empty file: ${file.name}`);
//                 continue;
//             }

//             const jsonsurvey = JSON.parse(surveyString)

//             if (!jsonsurvey.formid) {
//                 console.warn(`Missing formid: ${file.name}`);
//                 continue;
//             }

//             const formid = jsonsurvey.formid

//             const metadata = {
//                 metadata: {
//                     "formid": formid
//                 }
//             }

//             await file.setMetadata(metadata)
//         };

//     } catch (err) {
//         console.error(err)
//     }
// }