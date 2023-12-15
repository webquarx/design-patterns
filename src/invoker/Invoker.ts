import { InvokerTask, ICreateCommandFunc, TInvokerTask } from './TInvoker';
import InvokerTaskFactory from './factory/InvokerTaskFactory';
import Parallel from './Parallel';

export default class Invoker {
    private readonly tasks: InvokerTask[] = [];

    constructor(commands: TInvokerTask | TInvokerTask[]);

    constructor(items: any[], createCommand: ICreateCommandFunc);

    constructor(items: TInvokerTask | TInvokerTask[] | any[], createCommand?: ICreateCommandFunc) {
        this.tasks = new InvokerTaskFactory().create(items, createCommand);
    }

    parallel(limit?: number): Promise<any[]> {
        const parallels = new Parallel(this.tasks);
        return parallels.execute(limit);
    }
}
