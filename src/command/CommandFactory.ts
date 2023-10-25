import CommandExecuteFuncAdapter from './CommandExecuteFuncAdapter';
import { IExecuteFunc } from '../core/IExecutable';
import ICommand from './ICommand';

export default class CommandFactory {
    // eslint-disable-next-line class-methods-use-this
    create<T extends object>(command: IExecuteFunc | ICommand, props?: T): ICommand {
        if (typeof command === 'function') {
            return new CommandExecuteFuncAdapter<T>(command, props);
        }
        return command;
    }
}
