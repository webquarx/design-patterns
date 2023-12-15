import {
    InvokerTask, ICreateCommandFunc, TInvokerTask, TaskLimits,
} from './TInvoker';
import InvokerTaskFactory from './factory/InvokerTaskFactory';
import Parallel from './Parallel';

export default class Invoker {
    private readonly tasks: InvokerTask[] = [];

    constructor(commands: TInvokerTask | TInvokerTask[]);

    constructor(items: any[], createCommand: ICreateCommandFunc);

    constructor(items: TInvokerTask | TInvokerTask[] | any[], createCommand?: ICreateCommandFunc) {
        this.tasks = new InvokerTaskFactory().create(items, createCommand);
    }

    parallel(taskLimits: TaskLimits = { retries: 1 }, ...args: any[]): Promise<any[]> {
        const parallels = new Parallel(this.tasks, taskLimits.concurrent);
        return parallels.execute(...args);
    }
}
