import { Observable } from '@reactivex/rxjs';
import * as Context from './context';
import { Quad, Doc, Helpers } from 'feedbackfruits-knowledge-engine';

import { topicToDocs } from './types/topic';
import { videoToDocs } from './types/video';

const topictree = require('../topictree.json');

export function mine(): Observable<Doc> {
  const things = treeToObservable({}, topictree);
  return things.mergeMap(({ context, thing }) => {
    if (thing.kind === 'Video') {
      return videoToDocs(thing);
    } else if (thing.kind === 'Topic') {
      return topicToDocs(context, thing);
    }
  });
}

export function treeToObservable(context, thing): Observable<{ context, thing }> {
  return new Observable(observer => {
    if (thing.kind === 'Video') {
      observer.next({ context, thing });
      observer.complete();
    } else if (thing.kind === 'Topic') {
      observer.next({ context, thing });

      const iri = Helpers.iriify(thing.ka_url);
      const { observable } = thing.children.reduce((context, thing) => {
        const childObservable = treeToObservable(context, thing);
        return {
          ...context,
          observable: Observable.merge(context.observable, childObservable)
        };
      }, {
        parent: iri,
        previous: '',
        observable: Observable.empty()
      });

      observable.subscribe(observer);
    }
  });
}
