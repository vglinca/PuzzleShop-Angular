import { PipeTransform, Pipe } from '@angular/core';

@Pipe({
    name: 'rounded'
})
export class RoundPipe implements PipeTransform{
    transform(value: number, ...args: any[]) {
        return Number((value).toFixed(1));
    }
}