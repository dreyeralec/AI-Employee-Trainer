import { getSurveys } from '@/lib/bucketUtil';
import SurveysClient from './components/surveyClient';
import { Survey } from '@/lib/types';

export default async function SurveyServer() {
	//survey array for holding the surveys returned
	const surveys: Survey[] = await getSurveys();

	return (
		<SurveysClient surveys={surveys} />
	);
}