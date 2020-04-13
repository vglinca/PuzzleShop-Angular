import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'emptystringdecorator'
})
export class InsteadOfEmptyStringPipe implements PipeTransform{
    transform(value: string): string {
        if(value.length === 0){
            return 'NOT SET';
        }else{
            return value;
        }
    }
}