import { InvokerTask, TInvokerTask } from '../TInvoker';
import InvokerTaskStatus from '../InvokerTaskStatus';

export default class InvokerCommandTaskFactory {
    create(item: TInvokerTask): InvokerTask {
        const task = this.getTask(item);
        InvokerTaskStatus.setDefaultStatus(task);

        return task;
    }

    // eslint-disable-next-line class-methods-use-this
    private getTask(item: TInvokerTask): InvokerTask {
        if (item && 'command' in item) {
            return item;
        }
        return { command: item };
    }
}
