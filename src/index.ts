import fetch from 'node-fetch';
import * as Config from './config';
import { mine } from './miner';

import { Miner, Helpers, Config as _Config } from 'feedbackfruits-knowledge-engine';

export default async function init({ name }) {
  const send = await Miner({
    name,
    customConfig: Config as typeof _Config.Base
  });

  console.log('Starting Khan miner...');
  const docs = mine();

  let count = 0;
  await new Promise((resolve, reject) => {
    docs.subscribe({
      next: (doc) => {
        count++;
        // console.log('Sending doc:', doc['@id']);
        return send({ action: 'write', key: doc['@id'], data: doc });
      },
      error: (reason) => {
        console.log('Miner crashed...');
        reject(reason);
      },
      complete: () => {
        console.log('Miner completed');
        resolve();
      }
    });
  });

  console.log(`Mined ${count} docs from Khan Academy`);
  return;
}

// Start the server when executed directly
declare const require: any;
if (require.main === module) {
  console.log("Running as script.");
  init({
    name: Config.NAME,
  }).catch(console.error);
}
