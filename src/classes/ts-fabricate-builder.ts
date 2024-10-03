export class FabricateBuilder<T> {
    public data: T;
    constructor(data: T) {
      this.data = data;
    }
  
    public with(key: keyof T, value: () => any) {
      this.data[key] = value();
      return this;
    }
  
    public without(key: keyof T) {
      delete this.data[key];
      return this;
    }
  
    public done() {
      return this.data;
    }
  }