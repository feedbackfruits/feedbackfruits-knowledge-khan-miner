"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const feedbackfruits_knowledge_engine_1 = require("feedbackfruits-knowledge-engine");
const Context = require("feedbackfruits-knowledge-context");
function videoToDocs(video) {
    const iri = feedbackfruits_knowledge_engine_1.Helpers.iriify(video.ka_url);
    const videoIri = feedbackfruits_knowledge_engine_1.Helpers.iriify('https://www.youtube.com/watch?v=' + video.youtube_id);
    let quads = [];
    quads.push({ subject: iri, predicate: Context.Knowledge.resource, object: videoIri });
    quads.push({ subject: videoIri, predicate: Context.Knowledge.topic, object: iri });
    quads.push({ subject: videoIri, predicate: Context.type, object: Context.VideoObject });
    quads.push({ subject: videoIri, predicate: Context.type, object: Context.Knowledge.Resource });
    video.title && quads.push({ subject: videoIri, predicate: Context.name, object: video.title });
    video.description && quads.push({ subject: videoIri, predicate: Context.description, object: video.description });
    video.image_url && quads.push({ subject: videoIri, predicate: Context.image, object: feedbackfruits_knowledge_engine_1.Helpers.iriify(video.image_url) });
    video.license_url && quads.push({ subject: videoIri, predicate: Context.license, object: feedbackfruits_knowledge_engine_1.Helpers.iriify(video.license_url) });
    quads.push({ subject: videoIri, predicate: Context.sourceOrganization, object: 'KhanAcademy' });
    return feedbackfruits_knowledge_engine_1.Helpers.quadsToDocs(quads);
}
exports.videoToDocs = videoToDocs;
