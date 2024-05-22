import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'trim',
  standalone: true
})
export class TrimPipe implements PipeTransform {

  transform(value:string): unknown {
    return value.substring(0, 6) + '...';
  }

}

@Pipe({
  name: 'FilterPipe',
  standalone: true,
})
export class FilterPipe {
  transform<T>(items: T[] | null, searchText: string): T[] | null {
    if (!items) return [];
    if (searchText === '') return items;
    return items.filter((item) => {
      if (typeof item === 'string') {
        return item.toLowerCase().includes(searchText.toLowerCase());
      } else if (typeof item === 'object') {
        return Object.values(item as any).some(
          (value) => value && value.toString().toLowerCase().includes(searchText.toLowerCase())
        );
      } else {
        return false;
      }
    });
  }
}