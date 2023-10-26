import Command from './Command';
import CommandFactory from './factory/CommandFactory';
import { IExecuteFunc } from '../core/IExecutable';
import ICommand from './ICommand';
import IChainOfResponsibilityStep from '../chainOfResponsibility/IChainOfResponsibilityStep';

export function useCommand<T extends object>(execute: IExecuteFunc, props?: T): Command<T>;
export function useCommand<T extends object>(command: ICommand, props?: T): Command<T>;
export function useCommand(step: IChainOfResponsibilityStep): ICommand;

export function useCommand<T extends object>(
    command: IExecuteFunc | ICommand | IChainOfResponsibilityStep,
    props?: T,
): ICommand {
    return new CommandFactory().create<T>(command, props);
}
