import ICommand from './ICommand';

// @ts-expect-error TS2430: Interface Command<T> incorrectly extends interface 'T'
interface Command<T extends object> extends T {}

// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
abstract class Command<T extends object = NonNullable<unknown>> implements ICommand {
    constructor(props?: T) {
        if (props) {
            Object.assign(this, props);
        }
    }

    // eslint-disable-next-line class-methods-use-this
    canExecute(): Promise<boolean> | boolean {
        return true;
    }

    abstract execute(...args: any[]): Promise<any>;
}

export default Command;
