const mongoose = require("mongoose");
const redis = require('redis');
const util = require('util');

const client = redis.createClient('redis://127.0.0.1:6379');
const hget = util.promisify(client.hget);
const proto = mongoose.Query.prototype;
const exec = proto.exec;

client.flushall();

proto.cache = function(option = { expiration: 24 * 60 * 60, key: 'default' }) {
  this._useCache = true;
  if (typeof option.key !== 'string') {
    console.warn('A string key is recommended but got: ', option.key);
  }
  this._cacheOption = option;
  return this;
}

proto.exec = async function() {
  const key = JSON.stringify({
    ...this.getQuery(),
    collection: this.mongooseCollection.name,
  });
  if (this._useCache) {
    const existVal = await hget.call(client, this._cacheOption.key, key);
    if (existVal) {
      const data = JSON.parse(existVal);
      if (Array.isArray(data)) {
        return data.map(val => new this.model(val));
      }

      return new this.model(data);
    }
  }

  const result = await exec.apply(this, arguments);
  this._useCache && client.hset(
    this._cacheOption.key,
    key,
    JSON.stringify(result),
    'EX',
    this._cacheOption.expiration,
  );
  return result;
}

module.exports = {
  clearHash: (key) => client.del(key),
};