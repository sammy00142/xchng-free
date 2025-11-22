import type { AssetSelect } from "@/server/db/schema";

export class Pagination {
  data: AssetSelect[];
  pageSize: number;
  currentPage: number;

  constructor(data: AssetSelect[], pageSize: number, currentPage: number) {
    this.currentPage = currentPage;
    this.data = data;
    this.pageSize = pageSize;
  }

  getTotalPages() {
    return Math.ceil(this.data.length / this.pageSize);
  }
  getCurrentPageData(): AssetSelect[] {
    const begin = (this.currentPage - 1) * this.pageSize;
    const end = begin + this.pageSize;
    return this.data.slice(begin, end);
  }

  goToPage(page: number) {
    if (page > 0 && page <= this.getTotalPages()) {
      this.currentPage = page;
      return this.getCurrentPageData();
    }
  }

  nextPage(): void {
    if (this.currentPage < this.getTotalPages()) this.currentPage++;
  }

  previousPage(): void {
    if (this.currentPage > 1) this.currentPage--;
  }
}
