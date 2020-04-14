import { Pipe, PipeTransform } from '@angular/core';
import { isNull } from '@angular/compiler/src/output/output_ast';

@Pipe({
    name: 'emptystring'
})
export class InsteadOfEmptyStringPipe implements PipeTransform{
    transform(value: string){
        if(value === null){
            return 'NOT SET';
        }
        else if(value.length === 0){
                return 'NOT SET';
        }
        return value;
        
    }
}