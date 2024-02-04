import {
    ITask, ICreateCommandFunc, TTask, TaskLimits,
} from './TInvoker';
import InvokerTaskFactory from './factory/InvokerTaskFactory';
import Parallel from './Parallel';

export default class Invoker {
    protected readonly taskList: ITask[] = [];

    protected limits: TaskLimits = {
        retries: 1,
    };

    constructor(commands: TTask | TTask[]);

    constructor(items: any[], createCommand: ICreateCommandFunc);

    constructor(items: TTask | TTask[] | any[], createCommand?: ICreateCommandFunc) {
        this.taskList = new InvokerTaskFactory().create(items, createCommand);
    }

    get tasks(): ReadonlyArray<ITask> {
        return this.taskList;
    }

    limit(limits: TaskLimits): Invoker {
        const retries = typeof limits.retries === 'number' ? Math.max(1, limits.retries) : limits.retries || 1;
        this.limits = { ...limits, retries };
        return this;
    }

    parallel(...args: any[]): Promise<any[]> {
        const parallels = new Parallel(this.taskList, this.limits);
        return parallels.execute(...args);
    }
}
