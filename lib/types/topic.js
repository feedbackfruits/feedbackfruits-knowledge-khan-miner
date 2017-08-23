"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const feedbackfruits_knowledge_engine_1 = require("feedbackfruits-knowledge-engine");
const Context = require("feedbackfruits-knowledge-context");
function topicToDocs(context, topic) {
    const iri = feedbackfruits_knowledge_engine_1.Helpers.iriify(topic.ka_url);
    let quads = [];
    quads.push({ subject: iri, predicate: Context.type, object: Context.Knowledge.Topic });
    if (context.parent) {
        quads.push({ subject: iri, predicate: Context.Knowledge.parent, object: context.parent });
        quads.push({ subject: context.parent, predicate: Context.Knowledge.child, object: iri });
    }
    if (context.previous) {
        quads.push({ subject: iri, predicate: Context.Knowledge.previous, object: context.previous });
        quads.push({ subject: context.previous, predicate: Context.Knowledge.next, object: iri });
    }
    topic.title && quads.push({ subject: iri, predicate: Context.name, object: topic.title });
    topic.description && quads.push({ subject: iri, predicate: Context.description, object: topic.description });
    return feedbackfruits_knowledge_engine_1.Helpers.quadsToDocs(quads);
}
exports.topicToDocs = topicToDocs;
