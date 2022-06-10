export declare abstract class SerializeModel {
    static replacingMap?: TReplacingMap<any>;
}
export interface TModelConstructor<T, I> extends SerializeModel {
    replacingMap?: TReplacingMap<T>;
    new (args: I): T;
}
export declare type TReplacingMap<T = Record<string, any>> = {
    [key: string]: keyof T;
};
declare type TSerialize<T, A> = {
    data: Record<string, any>;
    root?: keyof Record<string, any>;
    instanceConstructor: TModelConstructor<T, A>;
};
export declare class Serialize<T extends SerializeModel, K, A> implements TSerialize<T, A> {
    model?: any;
    data: Record<string, any>;
    root?: keyof Record<string, any>;
    replacingMap?: TReplacingMap<T>;
    instanceConstructor: TModelConstructor<T, A>;
    constructor({ data, root, instanceConstructor }: TSerialize<T, A>);
    private replaceKeys;
    private getRoot;
    private createModel;
    getModel: () => K;
}
export {};
//# sourceMappingURL=serialize.d.ts.map