interface iOptions {
  /** Namespace for the current instance. */
  prefix?: string;
  /** A custom serialization function. */
  serialize?: (data: any) => string;
  /** A custom deserialization function. */
  deserialize?: (data: string) => any;
  /** The storage adapter instance to be used by MaybeStore. */
  store?: any;
  /** Default TTL. Can be overridden by specififying a TTL on `.set()`. */
  ttl?: number;
}

declare class MaybeStore {
  /**
   * @param opts The options object is also passed through to the storage adapter. Check your storage adapter docs for any extra options.
   */
  constructor(opts?: iOptions);

  /** Returns the namespace of a key */
  _getKeyPrefix(key: string): string;

  /** Returns the value. */
  get(key: string): Promise<any>;

  /**
   * Set a value.
   *
   * By default keys are persistent. You can set an expiry TTL in milliseconds.
   */
  set(key: string, value: any, ttl?: number): Promise<boolean>;

  /**
   * Deletes an entry.
   *
   * Returns `true` if the key existed, `false` if not.
   */
  delete(key: string): Promise<boolean>;

  /** Delete all entries in the current namespace. */
  clear(): Promise<void>;
}

export = MaybeStore;
