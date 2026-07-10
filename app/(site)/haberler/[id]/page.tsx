import { NewsDetailClient } from "@/components/site/news-detail";

export default function NewsDetailPage({ params }: { params: { id: string } }) {
  return <NewsDetailClient id={params?.id ?? ""} />;
}
