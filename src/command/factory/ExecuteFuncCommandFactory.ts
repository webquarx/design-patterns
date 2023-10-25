import { ICommandFactory } from './ICommandFactory';
import CommandExecuteFuncAdapter from '../CommandExecuteFuncAdapter';
import { IExecuteFunc } from '../../core/IExecutable';
import ICommand from '../ICommand';

export default class ExecuteFuncCommandFactory implements ICommandFactory {
    constructor(private readonly executeFunc: IExecuteFunc) {
    }

    create<T extends object>(props?: T): ICommand {
        return new CommandExecuteFuncAdapter<T>(this.executeFunc, props);
    }
}
