import { MongoClient } from 'mongodb';
import log from '../log';
import { mongoConnectionString } from '../settings';

export default class Mongo {
  constructor() {
    this.client = MongoClient;
  }

  connect() {
    return new Promise((resolve, reject) => {
      if (this.connected) { resolve(this.db); }
      this.client.connect(mongoConnectionString, (err, db) => {
        if (err) {
          reject(err);
        } else {
          this.db = db;
          this.connected = true;
          resolve(db);
        }
      });
    });
  }

  insert(/* collection, object*/) {
    if (!this.connected) { return false; }
    const myCollection = this.db.collection('myCollection');
    const texts = myCollection.find().toArray();
    return texts.then(results => log.log(results));
  }
}
