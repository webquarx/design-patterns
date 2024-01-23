import { ICreateCommandFunc, InvokerTask, TInvokerTask } from '../TInvoker';
import InvokerCommandTaskFactory from './InvokerCommandTaskFactory';

export default class InvokerTaskFactory {
    // eslint-disable-next-line class-methods-use-this
    create(
        item: TInvokerTask | TInvokerTask[] | any[],
        createCommand?: ICreateCommandFunc,
    ): InvokerTask[] {
        let commands = [];

        const items = this.toArray(item);
        if (typeof createCommand === 'function') {
            commands = this.createCommands(items, createCommand);
        } else {
            commands = items;
        }

        return this.toTasks(commands);
    }

    // eslint-disable-next-line class-methods-use-this
    private toArray(items: TInvokerTask | TInvokerTask[] | any[]) {
        return Array.isArray(items) ? items : [items];
    }

    // eslint-disable-next-line class-methods-use-this
    private createCommands(items: any[], createCommand: ICreateCommandFunc) {
        return items.map((item) => createCommand(item));
    }

    // eslint-disable-next-line class-methods-use-this
    private toTasks(commands: TInvokerTask[]): InvokerTask[] {
        return commands.map((item) => new InvokerCommandTaskFactory().create(item));
    }
}
