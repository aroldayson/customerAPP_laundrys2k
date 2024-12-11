import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'searchFilter',
  standalone: true // Optional: only use if the pipe is intended to be standalone
})
export class SearchFilterPipe implements PipeTransform {

  transform(trans: any[], keyword: string): any[] {
    if (!trans || !keyword) {
      return trans; // Return original array if no keyword is provided
    }
    keyword = keyword.toLowerCase(); // Normalize keyword for case-insensitive search

    // Filter the array
    return trans.filter(item => 
      Object.values(item).some(val => 
        String(val).toLowerCase().includes(keyword)
      )
    );
  }

}