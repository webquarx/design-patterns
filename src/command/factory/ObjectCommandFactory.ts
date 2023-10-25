import { ICommandFactory } from './ICommandFactory';
import ICommand from '../ICommand';
import CommandObjectAdapter from '../CommandObjectAdapter';

export default class ObjectCommandFactory implements ICommandFactory {
    constructor(private readonly command: ICommand & Record<string, any>) {
    }

    create<T extends object>(props?: T): ICommand {
        const cmdProps = this.createProps<T>(props);
        return new CommandObjectAdapter<typeof cmdProps>(this.command, cmdProps);
    }

    private createProps<T>(props?: T) {
        const cmd: Record<string, any> = {};
        const keys = Object.keys(this.command);
        for (let i = 0; i < keys.length; i++) {
            const key = keys[i];
            if (Object.prototype.hasOwnProperty.call(this.command, key)
                && key !== 'execute' && key !== 'canExecute'
            ) {
                cmd[key] = this.command[key];
            }
        }
        return { ...cmd, ...(props || {}) };
    }
}
