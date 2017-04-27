import rp from 'request-promise';
import { log } from '../../log';
import Mongo from '../mongo-connect';
/* connect to PoE stash tab api
 * get stash tabs
 * store them in a collection
 * */

/* Add Change Index
  const changeIndex = { value: res.next_change_id };
*/

function upsertStashes(db, stashes) {
  const stashesCollection = db.collection('stashes');
  return stashes.reduce((acc, stash) => acc.then(() => {
    log.log('updating stash: ', stash.id);
    return stashesCollection.replaceOne({ id: stash.id }, stash, { upsert: true });
  }), Promise.resolve());
}

class Runner {
  constructor(id) {
    this.id = id;
    this.mongo = new Mongo();
    this.options = {
      uri: 'http://api.pathofexile.com/public-stash-tabs/?id=63746829-67282221-63028447-73225445-68072722',
      headers: { 'User-Agent': 'Request-Promise' },
      json: true,
    };
  }

  setUriToNewId(id) {
    if (!id) { return Promise.reject(id); }
    log.log('updating uri id: ', id);
    this.id = id;
    this.options.uri = this.options.uri.replace(this.options.uri.split('=')[1], id);
    return Promise.resolve();
  }

  run() {
    return this.getChangeIndexId()
      .then(id => this.setUriToNewId(id))
      .then(
        () => {
          log.log('getting batch at id: ', this.id);
          return rp(this.options)
            .then(apiResponse => this.executeTask(apiResponse))
            .catch(err => log.dir(err));
        });
  }

  connectToMongo() {
    return this.mongo.connect();
  }

  getChangeIndexId() {
    return this.mongo.connect().then((db) => {
      const changeIndexCollection = db.collection('changeIndex');
      return new Promise((resolve) => {
        changeIndexCollection.find().toArray().then((array) => {
          resolve(array.pop().value);
        });
      });
    });
  }

  updateChangeIndex(id) {
    return this.mongo.connect().then((db) => {
      const changeIndexCollection = db.collection('changeIndex');
      return new Promise((resolve, reject) => {
        changeIndexCollection.count((err, count) => {
          if (err) { reject(err); }
          if (count === 0) {
            resolve(changeIndexCollection.insert({ value: id }));
          } else {
            resolve(changeIndexCollection.update({}, { value: id }));
          }
        });
      });
    });
  }

  executeTask(apiResponse) {
    const { next_change_id, stashes } = apiResponse;
    return this.mongo.connect().then(db => upsertStashes(db, stashes))
      .then(() => this.setUriToNewId(next_change_id))
      .then(() => this.updateChangeIndex(next_change_id))
      .then(() => log.log('finished'))
      .then(() => this.run())
      .catch(err => log.dir(err));
    // this.updateChangeIndex(db, id);
    // this.run();
  }
}

export default Runner;
