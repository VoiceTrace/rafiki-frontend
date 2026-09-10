import { EmptyStatePage } from "@/components/shared/empty-state-page";

export default function NotFound() {
  return <EmptyStatePage kind="not-found" appName="Rafiqi" title="We couldn’t find that page." description="It may have moved, or the link may not be quite right. Let’s get you back to learning." primaryAction="Back to today" primaryHref="/en/student/today" />;
}