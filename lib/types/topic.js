"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const feedbackfruits_knowledge_engine_1 = require("feedbackfruits-knowledge-engine");
function topicToDoc(context, topic) {
    const id = topic.ka_url;
    return Object.assign({ "@id": id, "@type": [feedbackfruits_knowledge_engine_1.Context.iris.$.Topic], name: topic.title, description: topic.description }, (context.parent ? { parent: {
            "@id": context.parent,
            child: [id]
        } } : {}), (context.previous ? { previous: {
            "@id": context.previous,
            next: [id]
        } } : {}));
}
exports.topicToDoc = topicToDoc;
