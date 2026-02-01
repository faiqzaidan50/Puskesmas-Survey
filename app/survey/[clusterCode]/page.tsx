import SurveyClient from "./survey-client";

type PageProps = {
  params: Promise<{
    clusterCode: string;
  }>;
};

export default async function Page({ params }: PageProps) {
  const { clusterCode } = await params;

  return <SurveyClient clusterCode={clusterCode} />;
}
