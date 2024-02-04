import { ICreateCommandFunc, ITask, TTask } from '../TInvoker';
import InvokerCommandTaskFactory from './InvokerCommandTaskFactory';

export default class InvokerTaskFactory {
    // eslint-disable-next-line class-methods-use-this
    create(
        item: TTask | TTask[] | any[],
        createCommand?: ICreateCommandFunc,
    ): ITask[] {
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
    private toArray(items: TTask | TTask[] | any[]) {
        return Array.isArray(items) ? items : [items];
    }

    // eslint-disable-next-line class-methods-use-this
    private createCommands(items: any[], createCommand: ICreateCommandFunc) {
        return items.map((item) => createCommand(item));
    }

    // eslint-disable-next-line class-methods-use-this
    private toTasks(commands: TTask[]): ITask[] {
        return commands.map((item) => new InvokerCommandTaskFactory().create(item));
    }
}
