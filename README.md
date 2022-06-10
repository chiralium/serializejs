![NPM Downloads](https://img.shields.io/npm/dw/@elexpr/serializejs)
![npm version](https://badge.fury.io/js/@elexpr%2Fserializejs.svg)

***SerializeJS***

Examples:

1. Create model and extend the `SerializeModel` abstract class:

```typescript
export interface IDarkStore {
	id: string;
	netName: string;
	name: string;
	coordinates: string[];
}

export class DarkStore extends SerializeModel {
	public id: string;
	public netName: string;
	public name: string;
	public coordinates: string[];

	public static replacingMap: TReplacingMap<DarkStore> = {
		"net_name": "netName",
		"darkstore_name": "name",
		"darkstore_coordinates": "coordinates",
	};

	constructor(args: IDarkStore) {
		super();
        
		this.id = args.id;
		this.netName = args.netName;
		this.name = args.name;
		this.coordinates = args.coordinates;
	}

	public get polygon(): number[][] {
		return this.coordinates.map(coordinate => {
			const [lat, lng] = coordinate.split(":");

			return [
				Number(lat),
				Number(lng),
			];
		});
	}
}
```

2. Use the `Serialize` helper:
```typescript
export class DarkStoreApi extends BaseApi {
	constructor() {
		super();
	}

	public getDarkStoreList = async (): Promise<DarkStore[]> => {
		const response = await this.getRequest("darkstore");
		return new Serialize<DarkStore, DarkStore[], IDarkStore>({
			data: response,
			instanceConstructor: DarkStore,
		}).getModel();
	};
}
```

define the generic types `DarkStore` as base type, `DarkStore[]` as generic type of base (as returned) & `IDarkStore` as type definition of constructor arguments.

Use the `getModel`-method to getting class instance.


If you need specify exactly the root of the response, for example:

You have response like:

```json
{
  "data": {
    "list": {
      "totalCount": 2,
      "items": [
        {
          "modelName": 1
        },
        {
          "modelName": 2
        }
      ]
    }
  },
  "errors": {
  },
  "message": {
  }
}
```

So, you able to specify the root of response like that:

```typescript
import {Serialize} from "./serialize";

new Serialize<Model, Model[], IModel>({
    response: data,
    root: 'data -> list -> items'
})
```