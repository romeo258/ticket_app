import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'ExtractArrayValue', standalone: true })
export class ExtractArrayValue implements PipeTransform {
  transform(value: number, args: string): number[] {
    return args === 'number' ? [...Array(value).keys()] : [];
  }
}