import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.css']
})
export class PaginationComponent {
  @Input() itemsPerPage: number;
  @Input() totalItems: number;
  @Input() currentPage: number;
  @Input() setCurrentPage: (page: number) => void;

  get pageNumbers(): number[] {
    const numbers = [];
    for (let i = 1; i <= Math.ceil(this.totalItems / this.itemsPerPage); i++) {
      numbers.push(i);
    }
    return numbers;
  }

  get currentShowing(): string {
    const indexOfLastItem = this.currentPage * this.itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - this.itemsPerPage;
    const lastItem = Math.min(indexOfLastItem, this.totalItems);
    return `${indexOfFirstItem + 1}-${lastItem} / ${this.totalItems}`;
  }

  get startPage(): number {
    const maxPagesToShow = 3;
    const halfMaxPagesToShow = Math.floor(maxPagesToShow / 2);
    let startPage = Math.max(1, this.currentPage - halfMaxPagesToShow);
    let endPage = Math.min(startPage + maxPagesToShow - 1, this.pageNumbers.length);
    if (endPage - startPage < maxPagesToShow - 1) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }
    return startPage;
  }

  get endPage(): number {
    const maxPagesToShow = 3;
    const halfMaxPagesToShow = Math.floor(maxPagesToShow / 2);
    let startPage = Math.max(1, this.currentPage - halfMaxPagesToShow);
    let endPage = Math.min(startPage + maxPagesToShow - 1, this.pageNumbers.length);
    if (endPage - startPage < maxPagesToShow - 1) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }
    return endPage;
  }
}

