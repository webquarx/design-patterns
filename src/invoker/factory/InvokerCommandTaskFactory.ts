import { InvokerTask, TInvokerTask } from '../TInvoker';

export default class InvokerCommandTaskFactory {
    create(item: TInvokerTask): InvokerTask {
        return this.getTask(item);
    }

    // eslint-disable-next-line class-methods-use-this
    private getTask(item: TInvokerTask): InvokerTask {
        if (item && 'command' in item) {
            return item;
        }
        return { command: item };
    }
}
