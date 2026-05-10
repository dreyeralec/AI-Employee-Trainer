import ChatClient from "./components/chatClient";
import { getSurvey } from "@/lib/bucketUtil";
import ErrorCard from "../surveysClient/components/errorCard";

export default async function ChatServer({
	searchParams
}: {
	searchParams: Promise<{ surveyID?: string }>;
}) {
	//get the parameters passed through the url
	const params = await searchParams;
	//assign surveyID to the surveyID parameter passed
	const surveyID = params.surveyID;

	//if this surveyID is missing go to the error page
	if (!surveyID) {
		return <ErrorCard/>
	}

	//get the survey from the GCS Bucket
	const survey = await getSurvey(surveyID);

	//pass this survey into the ChatClient component
	return <ChatClient survey={survey}/>
}