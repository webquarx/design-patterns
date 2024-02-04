import { ITaskResult } from '../TInvoker';

export default class TaskResult {
    static get default(): ITaskResult {
        return {
            error: undefined,
            value: undefined,
        };
    }
}
