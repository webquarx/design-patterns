import { IExecuteFunc } from '../../core/IExecutable';
import ICommand from '../ICommand';
import ExecuteFuncCommandFactory from './ExecuteFuncCommandFactory';
import ObjectCommandFactory from './ObjectCommandFactory';
import IChainOfResponsibilityStep from '../../chainOfResponsibility/IChainOfResponsibilityStep';

export default class CommandFactory {
    // eslint-disable-next-line class-methods-use-this
    create<T extends object>(
        command: IExecuteFunc | ICommand | IChainOfResponsibilityStep,
        props?: T,
    ): ICommand {
        if (typeof command === 'function') {
            return new ExecuteFuncCommandFactory(command).create<T>(props);
        }
        if (command && 'nextStep' in command) {
            return command;
        }
        return new ObjectCommandFactory(command).create<T>(props);
    }
}
