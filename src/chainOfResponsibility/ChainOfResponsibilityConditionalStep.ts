import ChainOfResponsibilityStep from './ChainOfResponsibilityStep';
import IChainOfResponsibilityStep from './IChainOfResponsibilityStep';
import { ICanExecuteFunc } from '../core/IExecutable';

export default class ChainOfResponsibilityConditionalStep extends ChainOfResponsibilityStep {
    private canExecuteResult?: boolean;

    constructor(
        private readonly canExecuteFunc: ICanExecuteFunc | boolean,
        private readonly lastStep: IChainOfResponsibilityStep,
    ) {
        super();
    }

    get canExecuteState() {
        return this.canExecuteResult;
    }

    async execute(...args: any[]): Promise<any> {
        this.canExecuteResult = this.canExecute(...args);
        if (this.canExecuteResult) {
            return await super.execute(...args);
        }
        return await this.executeLast(...args);
    }

    private canExecute(...args: any[]): boolean {
        const { canExecuteFunc } = this;
        if (typeof canExecuteFunc === 'boolean') {
            return canExecuteFunc;
        }
        if (typeof canExecuteFunc === 'function') {
            return !!canExecuteFunc(...args);
        }
        return true;
    }

    protected async executeLast(...args: any[]): Promise<any> {
        return await this.lastStep.execute(...args);
    }
}
