import Command from './Command';
import ICommand from './ICommand';

export default class CommandObjectAdapter<T extends object> extends Command<T> {
    constructor(private readonly command: ICommand, props?: T) {
        super(props);
    }

    canExecute(...args: any[]): boolean {
        return !!this.command.canExecute?.call(this, ...args);
    }

    async execute(...args: any[]): Promise<any> {
        return await this.command.execute.call(this, ...args);
    }
}
