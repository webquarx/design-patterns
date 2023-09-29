import ChainOfResponsibilityStep from './ChainOfResponsibilityStep';
import IChainOfResponsibilityStep from './IChainOfResponsibilityStep';
import { ICanExecutable } from '../core/IExecutable';

export default class ChainOfResponsibilityConditionalStep extends ChainOfResponsibilityStep {
    private readonly canExecuteRef;

    constructor(canExecutable: ICanExecutable, readonly lastStep: IChainOfResponsibilityStep) {
        super();
        this.canExecuteRef = () => canExecutable.canExecute;
    }

    canExecute(...args: any[]): boolean {
        const canExecuteRef = this.canExecuteRef();
        if (typeof canExecuteRef === 'boolean') {
            return canExecuteRef;
        }
        if (typeof canExecuteRef === 'function') {
            return !!canExecuteRef(...args);
        }
        return true;
    }

    async execute(...args: any[]): Promise<any> {
        if (this.canExecute(...args)) {
            return await super.execute(...args);
        }
        return await this.lastStep.execute(...args);
    }
}
