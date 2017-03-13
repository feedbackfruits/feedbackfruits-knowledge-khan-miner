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
  }
}


global['topictree'] = topictree;

let limit = 10; // Infinity;
let i = 0;

function mapExercise(exercise) {

  let { kind, title, license_url } = exercise;

  return { kind, title, license_url };
}

function mapVideo(video) {
  i++;
  let { kind, title, license_url } = video;

  return video;
  // return { kind, title, license_url };
}

function mapTopic(topic) {
  let { title, tags } = topic;
  // return topic;
  // return tags ? tags.join(', ') : undefined;
  return topic.kind;
  // return topic.license_url;
}

function reduceChildData(memo, childData) {
  if (i >= limit) return memo;
  let { kind } = childData;

  if (kind === 'Exercise') memo[`exercise-${i}`] = mapExercise(childData);

  return memo;
}

function reduceChildren(memo, child) {
  if (i > limit) return memo;
  let { kind, relative_url, children, child_data } = child;

  // if (kind === 'Topic') memo[relative_url] = mapTopic(child);
  if (kind === 'Video') memo[relative_url] = mapVideo(child);
  // if (kind === 'Exercise') memo[relative_url] = mapExercise(child);
  if (children) children.reduce(reduceChildren, memo);
  if (child_data) child_data.reduce(reduceChildData, memo);

  return memo;
}

const results = topictree.children.reduce(reduceChildren, {});

const quads = Object.keys(results).reduce((memo, key) => {
  const id = `<https://www.youtube.com/watch?v=${results[key].youtube_id}>`;
  return [
    ...memo,
    { subject: id, predicate: Context.type, object: Context.Movie},
  ]
}, []);

quads.reduce((memo, quad) => {
  return memo.then(() => {
    return queue.add(() => {
      console.log('hello!');
      return send({ type: 'write', quad });
    });
  });
}, Promise.resolve()).then(() => {
  console.log('done!');
});


// console.log(quads);
