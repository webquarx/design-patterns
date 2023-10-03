import ChainOfResponsibilityStep from './ChainOfResponsibilityStep';
import IChainOfResponsibilityStep from './IChainOfResponsibilityStep';
import { ICanExecutable } from '../core/IExecutable';

export default class ChainOfResponsibilityConditionalStep
    extends ChainOfResponsibilityStep implements ICanExecutable {
    private readonly canExecuteStep;

    constructor(canExecutable: ICanExecutable, readonly lastStep: IChainOfResponsibilityStep) {
        super();
        this.canExecuteStep = canExecutable.canExecute;
    }

    canExecute(...args: any[]): boolean {
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
        if (this.canExecute(...args)) {
            return await super.execute(...args);
        }
        return await this.lastStep.execute(...args);
    }
}
