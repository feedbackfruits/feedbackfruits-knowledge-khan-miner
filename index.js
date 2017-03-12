const topictree = require('./topictree.json');

global['topictree'] = topictree;

let limit = 10;
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

console.log(Object.keys(results).length);
console.log(results);
