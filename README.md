# ts-fabricate
Package of decorators and classes to facilitate random data generation in TypeScript

# How to use
I wanted to create a robust way to generate classes in Typescript, similar to a package like AutoFixture in C#.  There are constraints on this library mentioned in [Things to know](#things-to-know) in order for it to work, but in general it provides the functionality I think is useful.  While the use of decorators may be considered clutter, they are not required and only serve to allow true generation without needing to specify values within the test itself (as i've seen in other packages that generate classes).

There's a few ways to use this package: decorators and classes.  Let's start with the decorators.

## Decorator usage

```
import { array, type, enumeration } from 'ts-fabricate'

export enum Sex {
    M,
    F
}
export class Animal {
    @type(String)
    public name: string;
    @type(String, () => 'Lorem ipsum dolor sit')
    public description: string;
    @type(Boolean)
    public wild: boolean;
    @type(Number)
    public age: number;
    @enumeration(Sex)
    public sex: Sex;
    @array(Animal, 1)
    public siblings: Animal[];
}
```

Each decorator can be applied above a property to provide the necessary metadata for random generation.  As of 1.0.0 it is limited to classes (`@type`), primitive types (`@type`) which must use their class variant (`String`, `Boolean`, `Number`), enumerations (`@enumeration`), and arrays which accept a type and a length (`@array`).

Finally, in your tests where you will need this class generated you can call `Fabricate.create(Animal)`.

Optionally, with the `@type` decorator, you can also pass in a function which will tell the generator to use that specific value for all default generations.  This usage is depicted in the code example above.

## Class usage

As mentioned in Decorator usage, you can generate your defined classes with `Fabricate.create(Type)` where `Type` must be a defined class with decorators.

Alternatively, you can use the builder to create your objects in line in your test (they must still be classes)
- `Fabricate.build(Animal).with('name', () => 'Happy Dog').done()`

You can also use both together in case you would like a default setup as well as the possibility of overriding certain values.

`Fabricate` also has a `Fabricate.createMany(5)` method to generate an array of objects.

# Things to know

The library requires your objects be classes.  It will not work on interfaces alone, however you can utilize module merging like so:
```
interface Animal {}
class Animal {
    public wild: boolean;
    public genotype: string;
    public modality: 'bipedal' | 'quadripedal' | 'N/A
}
```

Despite the example above, this library has not been tested with string literals or Typescript Utility Types such as `Union`, `Record`, `Pick`, etc.