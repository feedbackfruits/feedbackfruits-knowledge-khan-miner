"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const rxjs_1 = require("@reactivex/rxjs");
const feedbackfruits_knowledge_engine_1 = require("feedbackfruits-knowledge-engine");
const topic_1 = require("./types/topic");
const video_1 = require("./types/video");
const topictree = require('../topictree.json');
function mine() {
    const things = treeToObservable({}, topictree);
    return things.mergeMap(({ context, thing }) => {
        if (thing.kind === 'Video') {
            return video_1.videoToDocs(thing);
        }
        else if (thing.kind === 'Topic') {
            return topic_1.topicToDocs(context, thing);
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
            const iri = feedbackfruits_knowledge_engine_1.Helpers.iriify(thing.ka_url);
            const { observable } = thing.children.reduce((context, thing) => {
                const childObservable = treeToObservable(context, thing);
                return Object.assign({}, context, { observable: rxjs_1.Observable.merge(context.observable, childObservable) });
            }, {
                parent: iri,
                previous: '',
                observable: rxjs_1.Observable.empty()
            });
            observable.subscribe(observer);
        }
    });
}
exports.treeToObservable = treeToObservable;
