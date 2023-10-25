import ICommand from '../ICommand';

export interface ICommandFactory {
    create<T extends object>(props?: T): ICommand,
}
