/**
 * Safely keep a reference to the given value via the given key.
 */
export default class Ref<K,V> {

  private map = new Map<K, V>();

  add(key: K, value: V): void {
    const existingValue = this.get(key);

    // check if a value already exists for given key
    if (existingValue !== undefined) {
      // don't throw an error if the value override results in a no-op
      if (value === existingValue) {
        return
      }

      throw new Error('cannot override existing reference')
    }

    this.map.set(key, value);
  }

  get(key: K): V | undefined {
    return this.map.get(key);
  }

  remove(key: K): boolean {
    return this.map.delete(key);
  }

  getAndRemove(key: K): V | undefined {
    const value = this.get(key);
    this.remove(key);
    return value;
  }

}
