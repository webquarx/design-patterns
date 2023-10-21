import IExecutable, { ICanExecuteFunc } from '../core/IExecutable';

export default interface ICommand extends IExecutable {
    canExecute?: ICanExecuteFunc,
}
