const EventEmitter = require('events');

const defaultOption = {
  prefix: 'ms',
  serialize: JSON.stringify,
  deserialize: JSON.parse,
};

function pTry(cb) {
  return new Promise((resolve) => {
    resolve(cb());
  });
}

class MaybeStore extends EventEmitter {
  constructor(opts = {}) {
    super();
    this.opts = Object.assign({}, defaultOption, opts);

    if (!this.opts.store) {
      this.opts.store = new Map();
    }

    this.store = this.opts.store;
  }

  _getKeyPrefix(key) {
    return `${this.opts.prefix}:${key}`;
  }

  get(key) {
    return pTry(() => this.store.get(this._getKeyPrefix(key))).then((data) => {
      data = typeof data === 'string' ? this.opts.deserialize(data) : data;
      if (data === undefined) {
        return undefined;
      }
      if (typeof data.expires === 'number' && Date.now() > data.expires) {
        this.delete(key);
        return undefined;
      }
      return data.value;
    });
  }

  set(key, value, ttl) {
    if (typeof ttl === 'undefined') {
      ttl = this.opts.ttl || 0;
    }

    if (ttl === 0) {
      ttl = undefined;
    }

    return pTry(() => {
      const expires = typeof ttl === 'number' ? Date.now() + ttl : null;
      const data = this.opts.serialize({ value, expires });
      return this.store.set(this._getKeyPrefix(key), data, ttl);
    }).then(() => true);
  }

  delete(key) {
    return pTry(() => this.store.delete(this._getKeyPrefix(key)));
  }

  clear() {
    return pTry(() => this.store.clear());
  }
}

module.exports = MaybeStore;
