import ChainOfResponsibility from './ChainOfResponsibility';
import { IConditionalChainOfResponsibility } from './IChainOfResponsibilityStep';
import ChainOfResponsibilityStepFactory from './ChainOfResponsibilityStepFactory';

export default class ConditionalChainOfResponsibility extends ChainOfResponsibility {
    private readonly canExecuteRef;

    private readonly lastStep;

    constructor(conditionalChain: IConditionalChainOfResponsibility) {
        super(conditionalChain.chain);

        const lastStep = ChainOfResponsibilityStepFactory.createEmptyStep();
        this.lastStep = this.setLast(lastStep);
        this.canExecuteRef = () => conditionalChain.canExecute;
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
