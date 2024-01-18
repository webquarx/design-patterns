import {
    InvokerTask, ICreateCommandFunc, TInvokerTask, TaskLimits,
} from './TInvoker';
import InvokerTaskFactory from './factory/InvokerTaskFactory';
import Parallel from './Parallel';

export default class Invoker {
    private readonly tasks: InvokerTask[] = [];

    private limits: TaskLimits = {
        retries: 1,
    };

    constructor(commands: TInvokerTask | TInvokerTask[]);

    constructor(items: any[], createCommand: ICreateCommandFunc);

    constructor(items: TInvokerTask | TInvokerTask[] | any[], createCommand?: ICreateCommandFunc) {
        this.tasks = new InvokerTaskFactory().create(items, createCommand);
    }

    limit(limits: TaskLimits): Invoker {
        const retries = typeof limits.retries === 'number' ? Math.max(1, limits.retries) : limits.retries || 1;
        this.limits = { ...limits, retries };
        return this;
    }

    parallel(...args: any[]): Promise<any[]> {
        const parallels = new Parallel(this.tasks, this.limits);
        return parallels.execute(...args);
    }
}
