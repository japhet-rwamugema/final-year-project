import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'trim',
  standalone: true
})
export class TrimPipe implements PipeTransform {

  transform(value: string): unknown {
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

@Pipe({
  name: 'sortByCreatedAt',
  standalone: true,
})
export class SortByCreatedAtPipe implements PipeTransform {
  transform(users: content[]): any[] {
    if (!users || users.length === 0) {
      return [];
    }

    return users.sort((a, b) => {
      const dateA = new Date(a.createdAt);
      const dateB = new Date(b.createdAt);

      return dateB.getTime() - dateA.getTime();
    });
  }
}

interface content {
    createdAt: string
    updatedAt: string
    id: string
    firstName: string
    lastName: string
    fullName: string
    phoneNumber: string
    email: string
    role: string
    status: string
    loginStatus: string
    lastLogin?: string
}