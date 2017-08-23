import { Quad, Doc, Helpers } from 'feedbackfruits-knowledge-engine';
import * as Context from 'feedbackfruits-knowledge-context';

export function videoToDocs(video): Doc[] {
  const iri = Helpers.iriify(video.ka_url);
  const videoIri = Helpers.iriify('https://www.youtube.com/watch?v=' + video.youtube_id);
  let quads: Quad[] = [];

  quads.push({ subject: iri, predicate: Context.Knowledge.resource, object: videoIri });
  quads.push({ subject: videoIri, predicate: Context.Knowledge.topic, object: iri });

  quads.push({ subject: videoIri, predicate: Context.type, object: Context.VideoObject });
  quads.push({ subject: videoIri, predicate: Context.type, object: Context.Knowledge.Resource });
  video.title && quads.push({ subject: videoIri, predicate: Context.name, object: video.title });
  video.description && quads.push({ subject: videoIri, predicate: Context.description, object: video.description });
  video.image_url && quads.push({ subject: videoIri, predicate: Context.image, object: Helpers.iriify(video.image_url) });
  video.license_url && quads.push({ subject: videoIri, predicate: Context.license, object: Helpers.iriify(video.license_url) });
  quads.push({ subject: videoIri, predicate: Context.sourceOrganization, object: 'KhanAcademy' });

  return Helpers.quadsToDocs(quads);
}
