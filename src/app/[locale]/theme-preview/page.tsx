import { notFound } from "next/navigation";
import { ThemePreview } from "@/components/shared/theme-preview";
export default function Page() {
 if (process.env.NODE_ENV !== "development") notFound();
 return <ThemePreview />;
}
