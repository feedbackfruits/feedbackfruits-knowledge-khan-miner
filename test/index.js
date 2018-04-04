import test from 'ava';

import memux from 'memux';
import init from '../lib';
import { NAME, KAFKA_ADDRESS, OUTPUT_TOPIC, INPUT_TOPIC, PAGE_SIZE, START_PAGE } from '../lib/config';

test('it exists', t => {
  t.not(init, undefined);
});

test('it works', async (t) => {
  try {
    let _resolve, _reject;
    const resultPromise = new Promise((resolve, reject) => {
      _resolve = resolve;
      _reject = reject;
    });

    const receive = (message) => {
      console.log('Received message!', message);
      _resolve(message);
    };

    await memux({
      name: 'dummy-broker',
      url: KAFKA_ADDRESS,
      input: OUTPUT_TOPIC,
      receive,
      options: {
        concurrency: 1
      }
    });

    await init({
      name: NAME,
    });

    const result = await resultPromise;
    console.log('Result data:', result.data);
    return t.deepEqual(result, {
      action: 'write',
      data: {
        '@id': 'https://www.khanacademy.org/video/adding-within-20',
        '@type': 'Topic',
        resource: [
          {
            '@id': 'https://www.youtube.com/watch?v=ZgzpTx-s9Zo',
            '@type': [
              'VideoObject',
              'Resource',
            ],
            description: 'Sal adds 7 + 6 using the number line.',
            image: [
              'https://cdn.kastatic.org/googleusercontent/kcVuw5mNJ4h8ricO56H2jpYjyBLymZ8yfk0-AJMnmgwUXvNbfcbMZjBL1ivs5gY9d3xsW_ck-lY4gYj6iLqmHfU2',
            ],
            license: [
              'http://creativecommons.org/licenses/by-nc-sa/3.0',
            ],
            name: 'Adding 7 + 6',
            sourceOrganization: [
              'https://www.khanacademy.org/',
            ],
            topic: [
              'https://www.khanacademy.org/video/adding-within-20',
            ],
          },
        ],
      },
      key: 'https://www.khanacademy.org/video/adding-within-20',
      label: NAME,
    });
  } catch(e) {
    console.error(e);
    throw e;
  }
});
