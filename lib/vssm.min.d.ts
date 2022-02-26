declare type GenericObject = {
    [key: string]: any;
};
declare type CombinedVSSMState = {
    [key: string]: VSSMState;
};
declare type MutationEvents = {
    [key: string]: CustomEvent;
};
declare type VSSMParameters = {
    [key: string]: VSSMParam;
};

declare class VSSM {
    combinedState: CombinedVSSMState;
    constructor(combinedState: CombinedVSSMState);
}

declare class VSSMState {
    private static defineParents;
    private static defineMutationEvents;
    private static initParams;
    name: string;
    origin: GenericObject;
    mutationEvents: MutationEvents;
    params: VSSMParameters;
    proxy: this;
    watchParam: (param: string, task: () => void) => void;
    constructor(name: string, obj: GenericObject);
}
declare class VSSMParam {
    value: any;
    key: string;
    parent: string;
    event: CustomEvent;
    tasks: {
        (): void;
    }[];
    performTasks: () => void;
    proxy: GenericObject;
    constructor(value: any, key: string, parent: string, event: CustomEvent);
}
export declare const createVSSM: (obj: CombinedVSSMState) => VSSM;
export declare const createState: (name: string, obj: GenericObject) => VSSMState;
export declare const getVSSM: () => CombinedVSSMState;
