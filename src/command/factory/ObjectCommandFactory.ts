import { ICommandFactory } from './ICommandFactory';
import ICommand from '../ICommand';

export default class ObjectCommandFactory implements ICommandFactory {
    constructor(private readonly command: ICommand & Record<string, any>) {
    }

    create<T extends object>(props?: T): ICommand {
        const cmdProps = this.createProps(props);
        return Object.assign(this.command, cmdProps);
    }

    // eslint-disable-next-line class-methods-use-this
    private createProps(props?: Record<string, any>) {
        if (!props) {
            return {};
        }
        const cmd: Record<string, any> = {};
        const keys = Object.keys(props);
        for (let i = 0; i < keys.length; i++) {
            const key = keys[i];
            if (Object.prototype.hasOwnProperty.call(props, key)
                && key !== 'execute' && key !== 'canExecute'
            ) {
                cmd[key] = props[key];
            }
        }
        return cmd;
    }
}
