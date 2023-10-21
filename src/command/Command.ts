import ICommand from './ICommand';

export default abstract class Command implements ICommand {
    // eslint-disable-next-line class-methods-use-this
    canExecute(): boolean {
        return true;
    }

    abstract execute(...args: any[]): Promise<any>;
}
