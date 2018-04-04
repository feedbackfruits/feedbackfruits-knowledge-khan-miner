import { Quad, Doc, Helpers, Context } from 'feedbackfruits-knowledge-engine';

export function topicToDoc(context, topic): Doc {
  const id = topic.ka_url;

  return {
    "@id": id,
    "@type": [ Context.iris.$.Topic ],
    name: topic.title,
    description: topic.description,
    ...(context.parent ? { parent: {
      "@id": context.parent,
      child: [ id ]
    } } : {}),
    ...(context.previous ? { previous: {
      "@id": context.previous,
      next: [ id ]
    } } : {})
  }
}
