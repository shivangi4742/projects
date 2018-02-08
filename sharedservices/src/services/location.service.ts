import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { Subject } from 'rxjs/Subject';

import 'rxjs/Rx';

@Injectable()
export class LocationService {
    private _subject = new Subject<any>();

    public locationChanged(): Observable<any> {
        return this._subject.asObservable();
    }

    public setLocation(loc: string) {
        this._subject.next(loc);
    }
}