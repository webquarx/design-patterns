import Command from './Command';
import { IExecuteFunc } from '../core/IExecutable';

export default class CommandExecuteFuncAdapter<T extends object> extends Command<T> {
    constructor(private readonly executeFunc: IExecuteFunc, params?: T) {
        super(params);
    }

    async execute(...args: any[]): Promise<any> {
        return await this.executeFunc.call(this, ...args);
    }
}
