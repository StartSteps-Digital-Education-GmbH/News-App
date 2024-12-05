export interface PaginatedResults<T> {
  data: T[];
  currentPage: number;
  totalPages: number;
}

export interface IArticles {
  source: {
    id: string;
    name: string;
  };
  author: string;
  title: string;
  description: string;
  url: string;
  publishedAt: string;
  content: string;
}

// comment for a commit