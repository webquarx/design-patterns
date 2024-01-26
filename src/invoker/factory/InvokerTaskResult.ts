import { InvokerTaskResult as TaskResult } from '../TInvoker';

export default class InvokerTaskResult {
    static get default(): TaskResult {
        return {
            error: undefined,
            value: undefined,
        };
    }
}
