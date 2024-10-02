import 'reflect-metadata';
const propertyDescriptor = {
    value: '',
    enumerable: true,
    writable: true,
    configurable: true,
  };

/**
 *
 * @param t Type that will be randomly generated
 * @param method An optional method that can be used to define the exact value to be assigned
 * 
 * As an example: () => "test value" would always assign the property with this decorator to the value "test value"
 * @returns void
 */
export function type<T>(t: new () => T, method?: () => T) {
    return function (target: Object, propertyKey: string | symbol) {
      Reflect.defineProperty(target, propertyKey, propertyDescriptor);
      Reflect.defineMetadata(
        'design:type',
        { constructor: t, data: method },
        target,
        propertyKey
      );
    };
  }
  
  /**
   *
   * @param t Enumeration type that will be randomly generated
   * @returns void
   */
  export function enumeration(t: { [key: string]: number | string }) {
    return function (target: Object, propertyKey: any) {
      Reflect.defineProperty(target, propertyKey, propertyDescriptor);
      Reflect.defineMetadata(
        'design:enum',
        { obj: t, keys: Object.keys(t) },
        target,
        propertyKey
      );
    };
  }
  
  /**
   *
   * @param t Type that will populate an array of length 5
   * @returns void
   */
  export function array(t: new () => any, length?: number) {
    return function (target: Object, propertyKey: any) {
      Reflect.defineProperty(target, propertyKey, propertyDescriptor);
      Reflect.defineMetadata('design:array', { constructor: t, length: length }, target, propertyKey);
    };
  }