import { Observable } from '@reactivex/rxjs';
import { Doc } from 'feedbackfruits-knowledge-engine';
export declare function mine(): Observable<Doc>;
export declare function treeToObservable(context: any, thing: any): Observable<{
    context;
    thing;
}>;
