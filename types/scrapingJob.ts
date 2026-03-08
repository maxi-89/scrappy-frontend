export type ScrapingJobStatus = 'pending' | 'running' | 'completed' | 'failed';

export interface ScrapingJobResponse {
  id: string;
  category: string;
  zone: string;
  status: ScrapingJobStatus;
  records_scraped?: number;
  error_message: string | null;
  started_at: string | null;
  finished_at: string | null;
  created_at: string;
}

export interface CreateScrapingJobRequest {
  category: string;
  zone: string;
}
