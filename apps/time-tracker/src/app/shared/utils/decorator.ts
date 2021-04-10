import 'reflect-metadata';

const defaultValuesMetadataKey = Symbol('DefaultValues');


export function ValidateDefaults(): ClassDecorator {
    return ctor => {
        console.group('ValidateDefaults');
        const proto = ctor.prototype;
        if (Reflect.hasMetadata(defaultValuesMetadataKey, proto)) {
            const metadata = Reflect.getMetadata(defaultValuesMetadataKey, proto);
            console.log('Setup defined properties from metadata', metadata);
            for (const entry of Object.entries(metadata)) {
                console.log('Setup property', entry[0]);

                const propKey = Symbol('Property for ' + entry[0]);
                const key = entry[0];
                const defaultValue = entry[1];

                Reflect.defineProperty(proto, key, {
                    get: function() {
                        console.log('Read property', key);
                        if ((this as any)[propKey] === undefined) {
                            return defaultValue;
                        } else {
                            return (this as any)[propKey];
                        }
                    },
                    set: function(value) {
                        console.log('Write property', key);
                        if (value !== undefined) {
                          (this as any)[propKey] = value;
                        }
                    }
                });

            }
            console.log('All properties defined', proto);
        }
        console.groupEnd();
    }
}

export function DefaultValue<T>(value: T): PropertyDecorator {
    return (proto, propertyKey) => {
        console.group('DefaultValue');
        console.log('Setup default value for', propertyKey);
        let metadata;
        if (!Reflect.hasMetadata(defaultValuesMetadataKey, proto)) {
            console.log('Define new metadata on', proto);
            metadata = { };
            Reflect.defineMetadata(defaultValuesMetadataKey, metadata, proto);
        } else {
            console.log('Target already has defined metadata', proto);
            metadata = Reflect.getMetadata(defaultValuesMetadataKey, proto);
        }
        console.log('Add metadata for property', propertyKey);
        metadata[propertyKey] = value;
        console.groupEnd();
    };
}


@ValidateDefaults()
class Greeter {
    @DefaultValue('test')
    prop!: string;

  // @format('Hello, %s')
  greeting: string;

  mSomeProp!: string;

  get someProp(): string {
    return this.mSomeProp;
  }

  set someProp(value: string) {
    this.mSomeProp = value;
  }
  constructor(message: string) {
    this.greeting = message;
  }
  greet() {
    // const formatString = getFormat(this, 'greeting');
    // return formatString.replace('%s', this.greeting);
  }
}
