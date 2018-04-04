"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const rxjs_1 = require("@reactivex/rxjs");
const Types = require("./types");
const topictree = require('../topictree.json');
function mine() {
    const things = treeToObservable({}, topictree);
    return things.mergeMap(({ context, thing }) => {
        if (thing.kind === 'Video') {
            return [Types.videoToDoc(thing)];
        }
        else if (thing.kind === 'Topic') {
            return [Types.topicToDoc(context, thing)];
        }
    });
}
exports.mine = mine;
function treeToObservable(context, thing) {
    return new rxjs_1.Observable(observer => {
        if (thing.kind === 'Video') {
            observer.next({ context, thing });
            observer.complete();
        }
        else if (thing.kind === 'Topic') {
            observer.next({ context, thing });
            const id = thing.ka_url;
            const { observable } = thing.children.reduce((context, thing) => {
                const childObservable = treeToObservable(context, thing);
                const childId = thing.ka_url;
                return Object.assign({}, context, { previous: childId, observable: rxjs_1.Observable.merge(context.observable, childObservable) });
            }, {
                parent: id,
                previous: '',
                observable: rxjs_1.Observable.empty()
            });
            observable.subscribe(observer);
        }
    });
}
exports.treeToObservable = treeToObservable;
