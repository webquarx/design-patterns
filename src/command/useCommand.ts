import Command from './Command';
import CommandFactory from './CommandFactory';
import { IExecuteFunc } from '../core/IExecutable';
import ICommand from './ICommand';

export function useCommand<T extends object>(execute: IExecuteFunc, props?: T): Command<T>;
export function useCommand(command: ICommand): ICommand;

export function useCommand<T extends object>(command: IExecuteFunc | ICommand, props?: T)
    : ICommand {
    return new CommandFactory().create<T>(command, props);
}
