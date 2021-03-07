export class HttpCollectionResponse {
  meta: {
    code: any,
    message: string
  };
  data: {
    docs: any[];
    hasNextPage: boolean;
    hasPrevPage: boolean;
    limit: number;
    nextPage: any;
    page: number;
    pagingCounter: number;
    prevPage: any;
    totalDocs: number;
    totalPages: number;
  };
}
