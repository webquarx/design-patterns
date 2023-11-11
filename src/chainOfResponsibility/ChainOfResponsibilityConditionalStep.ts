import ChainOfResponsibilityStep from './ChainOfResponsibilityStep';
import IChainOfResponsibilityStep from './IChainOfResponsibilityStep';
import { ICanExecuteFunc } from '../core/IExecutable';

export default class ChainOfResponsibilityConditionalStep extends ChainOfResponsibilityStep {
    canExecuteState?: boolean;

    constructor(
        readonly canExecuteStep: ICanExecuteFunc | boolean,
        readonly lastStep: IChainOfResponsibilityStep,
    ) {
        super();
    }

    private canExecute(...args: any[]): boolean {
        const { canExecuteStep } = this;
        if (typeof canExecuteStep === 'boolean') {
            return canExecuteStep;
        }
        if (typeof canExecuteStep === 'function') {
            return !!canExecuteStep(...args);
        }
        return true;
    }

    async execute(...args: any[]): Promise<any> {
        this.canExecuteState = this.canExecute(...args);
        if (this.canExecuteState) {
            return await super.execute(...args);
        }
        return await this.lastStep.execute(...args);
    }
}
