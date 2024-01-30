import { InvokerTask, TInvokerTask } from '../TInvoker';
import InvokerTaskStatus from '../tasks/InvokerTaskStatus';
import InvokerTaskResult from './InvokerTaskResult';

export default class InvokerCommandTaskFactory {
    create(item: TInvokerTask): InvokerTask {
        const task = this.getTask(item);
        if (!task.status) {
            task.status = InvokerTaskStatus.default;
        }
        if (!task.result) {
            task.result = InvokerTaskResult.default;
        }
        if (!task.retries) {
            task.retries = undefined;
        }

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
