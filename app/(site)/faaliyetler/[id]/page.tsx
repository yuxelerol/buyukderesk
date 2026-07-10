import { ActivityDetailClient } from "@/components/site/activity-detail";

export default function ActivityDetailPage({ params }: { params: { id: string } }) {
  return <ActivityDetailClient id={params?.id ?? ""} />;
}
