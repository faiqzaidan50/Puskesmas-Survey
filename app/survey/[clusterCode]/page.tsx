import SurveyClient from "./survey-client";

export default function SurveyPage({ params }: { params: { clusterCode: string } }) {
  return <SurveyClient clusterCode={params.clusterCode} />;
}
