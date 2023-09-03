import ChainOfResponsibilityStep from './ChainOfResponsibilityStep';
import { IExecuteFuncCallback } from '../core/IExecutable';

export default class ChainOfResponsibilityExecuteFuncAdapter extends ChainOfResponsibilityStep {
    constructor(private readonly executeFunc: IExecuteFuncCallback) {
        super();
    }

    async execute(...args: any[]) {
        return this.executeFunc(super.execute.bind(this), ...args);
    }
}
