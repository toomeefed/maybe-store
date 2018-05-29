import delay from 'delay';
import test from 'ava';
import MaybeStore from '..';

test('MaybeStore is a class', (t) => {
  t.is(typeof MaybeStore, 'function');
  t.throws(() => MaybeStore());
  t.notThrows(() => new MaybeStore());
});

test('MaybeStore accepts storage adapters', async (t) => {
  const store = new Map();
  const mStore = new MaybeStore({ store });
  t.is(store.size, 0);
  await mStore.set('foo', 'bar');
  t.is(await mStore.get('foo'), 'bar');
  t.is(store.size, 1);
});

test('MaybeStore passes tll info to stores', async (t) => {
  t.plan(1);
  const store = new Map();
  const storeSet = store.set;
  store.set = (key, val, ttl) => {
    t.is(ttl, 100);
    storeSet.call(store, key, val, ttl);
  };
  const mStore = new MaybeStore({ store });
  await mStore.set('foo', 'bar', 100);
});

test('MaybeStore respects default tll option', async (t) => {
  const mStore = new MaybeStore({ store: new Map(), ttl: 100 });
  await mStore.set('foo', 'bar');
  t.is(await mStore.get('foo'), 'bar');
  await delay(150);
  t.is(await mStore.get('foo'), undefined);
});

test('MaybeStore#set(key, val, ttl) overwrites default tll option', async (t) => {
  const store = new Map();
  const mStore = new MaybeStore({ store, ttl: 200 });
  await mStore.set('foo', 'bar');
  await mStore.set('fizz', 'buzz', 100);
  await mStore.set('ping', 'pong', 300);
  t.is(await mStore.get('foo'), 'bar');
  t.is(await mStore.get('fizz'), 'buzz');
  t.is(await mStore.get('ping'), 'pong');
  await delay(150);
  t.is(await mStore.get('foo'), 'bar');
  t.is(await mStore.get('fizz'), undefined);
  t.is(await mStore.get('ping'), 'pong');
  await delay(100);
  t.is(await mStore.get('foo'), undefined);
  t.is(await mStore.get('ping'), 'pong');
  await delay(100);
  t.is(await mStore.get('ping'), undefined);
});

test('MaybeStore.set(key, val, ttl) where ttl is "0" overwrites default tll option and sets key to never expire', async (t) => {
  const store = new Map();
  const mStore = new MaybeStore({ store, ttl: 200 });
  await mStore.set('foo', 'bar', 0);
  t.is(await mStore.get('foo'), 'bar');
  await delay(250);
  t.is(await mStore.get('foo'), 'bar');
});

test('MaybeStore uses custom serializer', async (t) => {
  t.plan(3);
  const store = new Map();
  const serialize = (data) => {
    t.pass();
    return JSON.stringify(data);
  };
  const deserialize = (data) => {
    t.pass();
    return JSON.parse(data);
  };
  const mStore = new MaybeStore({ store, serialize, deserialize });
  await mStore.set('foo', 'bar');
  t.is(await mStore.get('foo'), 'bar');
});

test('MaybeStore#clear', async (t) => {
  const store = new Map();
  const mStore = new MaybeStore({ store });
  await mStore.set('foo', 'bar');
  await mStore.set('baz', 'qux');
  await mStore.clear();
  t.is(store.size, 0);
});

test('MaybeStore#get undefined', async (t) => {
  const mStore = new MaybeStore();
  t.is(await mStore.get('foo'), undefined);
});
