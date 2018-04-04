"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const feedbackfruits_knowledge_engine_1 = require("feedbackfruits-knowledge-engine");
function videoToDoc(video) {
    const id = video.ka_url;
    const videoURL = 'https://www.youtube.com/watch?v=' + video.youtube_id;
    return {
        "@id": id,
        "@type": [
            feedbackfruits_knowledge_engine_1.Context.iris.$.Topic
        ],
        resource: {
            "@id": videoURL,
            "@type": [feedbackfruits_knowledge_engine_1.Context.iris.schema.VideoObject, feedbackfruits_knowledge_engine_1.Context.iris.$.Resource],
            name: video.title,
            description: video.description,
            image: video.image_url,
            license: [
                video.license_url
            ],
            topic: [
                id
            ],
            sourceOrganization: [
                "https://www.khanacademy.org/"
            ]
        }
    };
}
exports.videoToDoc = videoToDoc;
