import { OnDestroy, Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable()
export class NgOnDestroy extends Subject<null> implements OnDestroy{

    constructor(){
        super();
    }
    ngOnDestroy(): void {
        this.next(null);
        this.complete();
    }
}