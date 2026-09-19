import { useEffect, useState } from "react";
import {
  CalendarDays,
  Images,
  MessageSquare,
  Tags,
  Users,
} from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { reportService } from "@/features/reports/services/reportService";
import type { ReportSummary } from "@/features/reports/types/report";
import { getErrorMessage } from "@/utils/error";

export function ReportsPage() {
  const [summary, setSummary] = useState<ReportSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await reportService.getSummary();
      setSummary(data);
    } catch (loadError) {
      setError(getErrorMessage(loadError));
      setSummary(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Reports"
        title="Gallery overview"
        description="Live counts across users, collections, exhibitions, and inquiries."
        actions={
          <Button type="button" variant="outline" onClick={() => void load()}>
            Refresh
          </Button>
        }
      />

      {error ? (
        <Alert variant="destructive">
          <AlertDescription className="flex flex-wrap items-center justify-between gap-3">
            <span>{error}</span>
            <Button type="button" size="sm" variant="outline" onClick={() => void load()}>
              Retry
            </Button>
          </AlertDescription>
        </Alert>
      ) : null}

      {isLoading ? (
        <div className="flex items-center gap-2 text-muted-foreground">
          <LoadingSpinner label="Loading reports" />
          Loading report summary...
        </div>
      ) : null}

      {summary ? (
        <>
          <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Visitors</CardDescription>
                <CardTitle className="text-3xl">{summary.visitorCount}</CardTitle>
              </CardHeader>
              <CardContent className="flex items-center gap-2 text-sm text-muted-foreground">
                <Users className="size-4" />
                Registered visitor accounts
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Artist accounts</CardDescription>
                <CardTitle className="text-3xl">
                  {summary.artistAccountCount}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                Profiles in Artists table: {summary.artistProfileCount}
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Categories</CardDescription>
                <CardTitle className="text-3xl">{summary.categoryCount}</CardTitle>
              </CardHeader>
              <CardContent className="flex items-center gap-2 text-sm text-muted-foreground">
                <Tags className="size-4" />
                Artwork categories
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Artworks</CardDescription>
                <CardTitle className="text-3xl">{summary.artworkCount}</CardTitle>
              </CardHeader>
              <CardContent className="flex items-center gap-2 text-sm text-muted-foreground">
                <Images className="size-4" />
                Stored with binary images
              </CardContent>
            </Card>
          </section>

          <section className="grid gap-4 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Artworks by status</CardTitle>
                <CardDescription>Available, sold, displayed, archived</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {summary.artworksByStatus.map((item) => (
                  <div
                    key={item.status}
                    className="flex items-center justify-between text-sm"
                  >
                    <span className="text-muted-foreground">{item.label}</span>
                    <span className="font-medium">{item.count}</span>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Exhibitions</CardTitle>
                <CardDescription>Schedule snapshot</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-2 text-muted-foreground">
                    <CalendarDays className="size-4" />
                    Total
                  </span>
                  <span className="font-medium">{summary.exhibitionCount}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Active now</span>
                  <span className="font-medium">{summary.activeExhibitionCount}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Upcoming</span>
                  <span className="font-medium">
                    {summary.upcomingExhibitionCount}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Past</span>
                  <span className="font-medium">{summary.pastExhibitionCount}</span>
                </div>
              </CardContent>
            </Card>

            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Inquiries</CardTitle>
                <CardDescription>
                  {summary.newInquiryCount} new · {summary.inquiryCount} total
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {summary.inquiriesByStatus.map((item) => (
                  <div
                    key={item.status}
                    className="rounded-lg border border-border p-4"
                  >
                    <p className="flex items-center gap-2 text-xs uppercase tracking-[0.14em] text-muted-foreground">
                      <MessageSquare className="size-3.5" />
                      {item.label}
                    </p>
                    <p className="mt-2 text-2xl font-semibold">{item.count}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </section>

          <p className="text-xs text-muted-foreground">
            Generated at {new Date(summary.generatedAt).toLocaleString()}
          </p>
        </>
      ) : null}
    </div>
  );
}
