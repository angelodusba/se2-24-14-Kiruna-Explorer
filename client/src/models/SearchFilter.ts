export interface SearchFilter {
  title?: string;
  description?: string;
  types?: number[];
  start_year?: string;
  end_year?: string;
  scales?: string[];
  languages?: string[];
  stakeholders?: number[];
  keywords?: string[];
  municipality?: boolean;
}
