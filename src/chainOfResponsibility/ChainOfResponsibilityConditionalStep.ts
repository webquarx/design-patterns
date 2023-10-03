import ChainOfResponsibilityStep from './ChainOfResponsibilityStep';
import IChainOfResponsibilityStep from './IChainOfResponsibilityStep';
import { ICanExecutable, ICanExecuteFunc } from '../core/IExecutable';

export default class ChainOfResponsibilityConditionalStep
    extends ChainOfResponsibilityStep implements ICanExecutable {
    constructor(
        readonly canExecuteStep: ICanExecuteFunc | boolean,
        readonly lastStep: IChainOfResponsibilityStep,
    ) {
        super();
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
