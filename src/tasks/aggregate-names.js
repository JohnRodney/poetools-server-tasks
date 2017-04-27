import { log } from '../../log';
import Mongo from '../mongo-connect';

/* TODO:
 * collect list of distinct item names
 * save that list to a names collection
 * */
function cleanArray(array) {
  return Promise.resolve(array.map(name => name.replace(/<.*>/, '')));
}

class Runner {
  constructor() {
    this.mongo = new Mongo();
  }

  run() {
    this.mongo.connect().then((db) => {
      const result = db.collection('stashes').distinct('items.name').then(names => cleanArray(names));
      return result.then(cleanNames =>
        db.collection('names').replaceOne({}, { names: cleanNames }, { upsert: true }));
    }).catch(err => log.dir(err));
  }
}

export default Runner;
