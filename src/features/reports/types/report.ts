export interface StatusCount {
  status: number;
  label: string;
  count: number;
}

export interface ReportSummary {
  visitorCount: number;
  artistAccountCount: number;
  artistProfileCount: number;
  categoryCount: number;
  artworkCount: number;
  artworksByStatus: StatusCount[];
  exhibitionCount: number;
  activeExhibitionCount: number;
  upcomingExhibitionCount: number;
  pastExhibitionCount: number;
  inquiryCount: number;
  newInquiryCount: number;
  inquiriesByStatus: StatusCount[];
  generatedAt: string;
}

export interface ApiSuccessResponse<T> {
  success: boolean;
  message: string;
  data: T;
}
