
import { faker } from '@faker-js/faker';
import 'reflect-metadata';
import { TSRandomBuilder } from './ts-random-builder';

/**
 * Class used to randomly generate or build a class.
 * In order to facilitate random data, your class properties must
 * include decorators provided by the equipp-spa-lib package.  These include
 * {@link type}, {@link enumeration}, and {@link array}
 */
export class TSRandom {
    public static generate<T>(_: new () => T): T {
      let random: T = new _();
      let properties = Object.getOwnPropertyDescriptors(_.prototype);
      let keys = Object.keys(properties).filter((k) => k !== 'constructor');
      keys.forEach((key) => {
        let newProperty = { ...properties[key] };
        newProperty.value = this.getRandomValue(random, key);
        Object.defineProperty(random, key, newProperty);
      });
      return random;
    }
  
    public static generateMany<T>(_: new () => T, count = 5): T[] {
      return Array(count).fill((() => this.generate(_))());
    }
  
    public static build<T>(_: new () => T): TSRandomBuilder<T> {
      return new TSRandomBuilder(this.generate(_));
    }
  
    private static getRandomValue(obj: any, key: any) {
      const type: any = Reflect.getMetadata('design:type', obj, key);
      const array: any = Reflect.getMetadata('design:array', obj, key);
      const enumeration: any = Reflect.getMetadata('design:enum', obj, key);
      if (enumeration) {
        return enumeration.obj[faker.helpers.arrayElement<any>(enumeration.keys)];
      }
      if (array) {
        let length = array.length ? array.length : 5;
        let newArray = new Array(length).fill(1);
        newArray = newArray.map(() => {
          return this.constructType({ constructor: array, data: undefined });
        });
        return newArray;
      }
      if (type) {
        return this.constructType(type);
      }
    }
  
    private static constructType(type: any) {
      const constructedType =
        type.constructor !== undefined ? new type.constructor() : new type();
      if (constructedType instanceof String) {
        return type.data !== undefined ? type.data() : faker.datatype.string();
      } else if (constructedType instanceof Number) {
        return type.data !== undefined ? type.data() : faker.datatype.number();
      } else if (constructedType instanceof Boolean) {
        return type.data !== undefined ? type.data() : faker.datatype.boolean();
      } else {
        return TSRandom.generate(
          type.constructor !== undefined ? type.constructor : type
        );
      }
    }
  }