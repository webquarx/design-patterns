import { InvokerTask, ICreateCommandFunc, TInvokerTask } from './TInvoker';
import InvokerTaskFactory from './factory/InvokerTaskFactory';

export default class Invoker {
    private readonly tasks: InvokerTask[] = [];

    constructor(commands: TInvokerTask | TInvokerTask[]);

    constructor(items: any[], createCommand: ICreateCommandFunc);

    constructor(items: TInvokerTask | TInvokerTask[] | any[], createCommand?: ICreateCommandFunc) {
        this.tasks = new InvokerTaskFactory().create(items, createCommand);
    }
}
