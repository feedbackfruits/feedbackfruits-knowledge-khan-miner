import { Quad, Doc, Helpers, Context } from 'feedbackfruits-knowledge-engine';

export function videoToDoc(video): Doc {
  const id = video.ka_url;
  const videoURL = 'https://www.youtube.com/watch?v=' + video.youtube_id;

  return {
    "@id": id,
    "@type": [
      Context.iris.$.Topic
    ],
    resource: {
      "@id": videoURL,
      "@type": [ Context.iris.schema.VideoObject, Context.iris.$.Resource ],

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
