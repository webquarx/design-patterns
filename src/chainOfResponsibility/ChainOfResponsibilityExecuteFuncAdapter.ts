import ChainOfResponsibilityStep from './ChainOfResponsibilityStep';
import { IExecuteFuncCallback } from '../core/IExecutable';

export default class ChainOfResponsibilityExecuteFuncAdapter extends ChainOfResponsibilityStep {
    constructor(private readonly executeFunc: IExecuteFuncCallback) {
        super();
    }

    async execute(...args: any[]): Promise<any> {
        return await this.executeFunc(super.execute.bind(this), ...args);
    }
}
