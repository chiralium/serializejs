export abstract class SerializeModel {
    public static replacingMap?: TReplacingMap<any>;
}

export interface TModelConstructor<T, I> extends SerializeModel {
    replacingMap?: TReplacingMap<T>;
    new (args: I): T;
}

export type TReplacingMap<T = Record<string, any>> = {
    [key: string]: keyof T;
}

type TSerialize<T, A> = {
    data: Record<string, any>,
    root?: keyof Record<string, any>,
    instanceConstructor: TModelConstructor<T, A>,
}

export class Serialize<T extends SerializeModel, K, A> implements TSerialize<T, A>{
    public model?: any;
    public data: Record<string, any>;
    public root?: keyof Record<string, any>;
    public replacingMap?: TReplacingMap<T>;
    public instanceConstructor: TModelConstructor<T, A>;

    constructor({data, root, instanceConstructor}: TSerialize<T, A>) {
        this.data = data;
        this.root = root;
        this.replacingMap = instanceConstructor.replacingMap;
        this.instanceConstructor = instanceConstructor;
    }

    private replaceKeys = (data: Record<string, any>): Record<string, any> => {
        if (!this.replacingMap) {
            return data;
        }

        return Object.keys(data)
            .reduce((acc, key) => {
                const newKey = (this.replacingMap as TReplacingMap<T>)[key];
                const newPair = newKey ? {
                    [newKey]: data[key],
                } : {[key]: data[key]};

                return {
                    ...acc,
                    ...newPair,
                };
            }, {});
    };

    private getRoot = () => {
        if (!this.root) {
            return {};
        }

        const pathItemList = this.root.split('->')
            .map(pathItem => pathItem.trim());

        return pathItemList.reduce((acc, pathItem) => {
            return acc[pathItem];
        }, this.data);
    }

    private createModel = (): void => {
        try {
            this.data = this.getRoot();

            if (Array.isArray(this.data)) {
                this.model = this.data.map(dataItem => new this.instanceConstructor(this.replaceKeys(dataItem) as A));
                return;
            }
            this.model = new this.instanceConstructor(this.replaceKeys(this.data) as A);
        } catch (e) {
            console.error(e);
        }
    };

    public getModel = (): K => {
        this.createModel();

        return this.model as K;
    };
}