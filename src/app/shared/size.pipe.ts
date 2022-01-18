import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'size'
})
export class SizePipe implements PipeTransform {

  transform(filesSize: number, maxFileSize?: number[]): string {
    return maxFileSize
      ? `${(filesSize / 1000000).toFixed(2)} MB of ${[maxFileSize]}MB`
      : `${(filesSize / 1000000).toFixed(2)} MB`;
  }

}
