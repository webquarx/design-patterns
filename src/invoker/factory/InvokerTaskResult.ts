import { ITaskResult } from '../TInvoker';

export default class InvokerTaskResult {
    static get default(): ITaskResult {
        return {
            error: undefined,
            value: undefined,
        };
    }
}
