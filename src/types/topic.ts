import { Quad, Doc, Helpers } from 'feedbackfruits-knowledge-engine';
import * as Context from 'feedbackfruits-knowledge-context';

export function topicToDocs(context, topic): Doc[] {
  const iri = Helpers.iriify(topic.ka_url);
  let quads: Quad[] = [];

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

  return Helpers.quadsToDocs(quads);
}
