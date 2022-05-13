***SerializeJS***

Examples:

1. Create model and extend the `SerializeModel` abstract class:

```
export interface IDarkStore {
	id: string;
	netName: string;
	name: string;
	coordinates: string[];
}

export class DarkStore implements SerializeModel{
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
```
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

Use the `getModel`-method to getting class instance
