import { StudentRafiqiPage } from "@/features/student-rafiqi/components/student-rafiqi-page";

export default async function Page({ searchParams }: { searchParams: Promise<{ prompt?: string }> }) {
  const { prompt } = await searchParams;
  return <StudentRafiqiPage initialPrompt={prompt} />;
}
