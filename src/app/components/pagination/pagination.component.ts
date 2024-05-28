import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.css'
})
export class PaginationComponent {
  @Input() currentPage!: number;
  @Input() totalPages!: number;
  @Output() pageChanged = new EventEmitter<number>();

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.pageChanged.emit(page);
    }
  }

}
