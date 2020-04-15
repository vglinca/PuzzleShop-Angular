import { PipeTransform, Pipe } from '@angular/core';

@Pipe({
    name: 'shorten'
})
export class ShortenStringPipe implements PipeTransform{
    transform(value: string, ...args: any[]) {
        var n = +args[0];
        if(n > 0){
            return value.substring(0, n) + '...';
        }
    }
}