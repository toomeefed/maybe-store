# maybe-store

> 也许是你想要的 K/V 缓存模块

  [![Travis](https://img.shields.io/travis/toomeefed/maybe-store.svg)](https://travis-ci.org/toomeefed/maybe-store)
  [![Coverage Status](https://img.shields.io/coveralls/toomeefed/maybe-store/master.svg?style=flat)](https://coveralls.io/github/toomeefed/maybe-store?branch=master)
  [![David](https://img.shields.io/david/toomeefed/maybe-store.svg)](https://david-dm.org/toomeefed/maybe-store)
  [![npm (scoped)](https://img.shields.io/npm/v/@toomee/maybe-store.svg)](https://www.npmjs.com/package/@toomee/maybe-store)
  [![node (scoped)](https://img.shields.io/node/v/@toomee/maybe-store.svg)](https://github.com/toomeefed/maybe-store)
  [![GitHub license](https://img.shields.io/github/license/toomeefed/maybe-store.svg)](https://github.com/toomeefed/maybe-store/blob/master/LICENSE)

> PS: 借(抄)鉴(袭) [keyv](https://github.com/lukechilds/keyv)

一个简单的 key/value 存储适配器，支持扩展任意数据库。支持 ttl 有效期参数，合适作为缓存使用。


## 安装

```sh
$ yarn add @toomee/maybe-store # 推荐
# 或者
$ npm i -S @toomee/maybe-store
```

## 使用

```js
const MaybeStore = require('@toomee/maybe-store');

const store = new MaybeStore();

await store.set('foo', 'expires in 1 second', 1000); // true
await store.set('foo', 'never expires'); // true
await store.get('foo'); // 'never expires'
await store.delete('foo'); // true
await store.clear(); // undefined
```

## License

MIT
