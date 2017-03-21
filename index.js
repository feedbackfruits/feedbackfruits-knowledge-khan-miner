require('dotenv').load({ silent: true });

// const KHAN_API_ENDPOINT = 'https://academic.microsoft.com/api/browse/GetEntityDetails';

const {
  NAME = 'khan-academy',
  KAFKA_ADDRESS = 'tcp://kafka:9092',
  OUTPUT_TOPIC = 'quad_update_requests',
} = process.env;

const memux = require('memux');
const fetch = require('node-fetch');
const PQueue = require('p-queue');
const jsonld = require('jsonld').promises;
const log = console.log.bind(console);

const { send } = memux({
  name: NAME,
  url: KAFKA_ADDRESS,
  output: OUTPUT_TOPIC
});

const queue = new PQueue({
  concurrency: 16
});

const topictree = require('./topictree.json');

const Context = {
  type: '<http://www.w3.org/1999/02/22-rdf-syntax-ns#type>',
  name: '<http://schema.org/name>',
  image: '<http://schema.org/image>',
  description: '<http://schema.org/description>',
  text: '<http://schema.org/text>',
  url: '<http://schema.org/url>',
  sameAs: '<http://schema.org/sameAs>',
  license: '<http://schema.org/license>',
  author: '<http://schema.org/author>',
  about: '<http://schema.org/about>',
  citation: '<http://schema.org/citation>',
  CreativeWork: '<http://schema.org/CreativeWork>',
  VideoObject: '<http://schema.org/VideoObject>',
  Movie: '<http://schema.org/Movie>',
  Person: '<http://schema.org/Person>',
  ReadAction: '<http://schema.org/ReadAction>',
  WriteAction: '<http://schema.org/WriteAction>',

  KhanAcademy: {
    Topic: '<https://www.khanacademy.org/Topic>',
    childTopic: '<https://www.khanacademy.org/childTopic>',
    parentTopic: '<https://www.khanacademy.org/parentTopic>'
  },

  AcademicGraph: {
    FieldOfStudy: '<http://academic.microsoft.com/FieldOfStudy>',
    parentFieldOfStudy: '<http://academic.microsoft.com/parentFieldOfStudy>',
    childFieldOfStudy: '<http://academic.microsoft.com/childFieldOfStudy>'
  },


  Knowledge: {
    Topic: '<https://knowledge.express/Topic>',
    next: '<https://knowledge.express/next>',
    previous: '<https://knowledge.express/previous>',
    child: '<https://knowledge.express/child>',
    parent: '<https://knowledge.express/parent>',
    resource: '<https://knowledge.express/resource>',

    Resource: '<https://knowledge.express/Resource>',
    topic: '<https://knowledge.express/topic>',
    entity: '<https://knowledge.express/entity>',

    Entity: '<https://knowledge.express/Entity>',
  }
}


global['topictree'] = topictree;
let i = 0;

const queuedSend = quad => queue.add(() => {
  console.log(i++);
  const action = { type: 'write', quad };
  return send(action);
});


function doThing(memo, thing) {
  const iri = irify(thing.ka_url);

  queuedSend({ subject: iri, predicate: Context.type, object: Context.Knowledge.Topic });

  if (memo.parent) {
    queuedSend({ subject: iri, predicate: Context.Knowledge.parent, object: memo.parent });
    queuedSend({ subject: memo.parent, predicate: Context.Knowledge.child, object: iri });
  }

  if (memo.previous) {
    queuedSend({ subject: iri, predicate: Context.Knowledge.previous, object: memo.previous });
    queuedSend({ subject: memo.previous, predicate: Context.Knowledge.next, object: iri });
  }

  thing.title && queuedSend({ subject: iri, predicate: Context.name, object: thing.title });
  thing.description && queuedSend({ subject: iri, predicate: Context.description, object: thing.description });

  switch (thing.kind) {
    case 'Topic':
      return doTopic(memo, thing);
    case 'Video':
      return doVideo(memo, thing);
  }

  return memo;
}

const irify = uri => `<${uri}>`;

function doTopic(memo, topic) {
  const iri = irify(topic.ka_url);

  topic.children.reduce(doThing, Object.assign({}, memo, {
    parent: iri,
    previous: ''
  }));

  return Object.assign({}, memo, {
    previous: iri,
  });
}

function doVideo(memo, video) {
  const iri = irify(video.ka_url);
  const videoIri = irify('https://www.youtube.com/watch?v=' + video.youtube_id);

  queuedSend({ subject: iri, predicate: Context.Knowledge.resource, object: videoIri });
  queuedSend({ subject: videoIri, predicate: Context.Knowledge.topic, object: iri });

  queuedSend({ subject: videoIri, predicate: Context.type, object: Context.VideoObject });
  queuedSend({ subject: videoIri, predicate: Context.type, object: Context.Knowledge.Resource });
  video.title && queuedSend({ subject: videoIri, predicate: Context.name, object: video.title });
  video.description && queuedSend({ subject: videoIri, predicate: Context.description, object: video.description });
  video.image_url && queuedSend({ subject: videoIri, predicate: Context.image, object: irify(video.image_url) });
  video.license_url && queuedSend({ subject: videoIri, predicate: Context.license, object: irify(video.license_url) });

  return memo;
}

doThing({}, topictree);
