import ChainOfResponsibility from './ChainOfResponsibility';
import { IConditionalChainOfResponsibility } from './IChainOfResponsibilityStep';
import ChainOfResponsibilityStepFactory from './ChainOfResponsibilityStepFactory';

export default class ConditionalChainOfResponsibility extends ChainOfResponsibility {
    private readonly canExecute;

    private readonly lastStep;

    constructor(chain: IConditionalChainOfResponsibility) {
        super(chain.steps);

        const lastStep = ChainOfResponsibilityStepFactory.createEmptyStep();
        this.lastStep = this.setNext(lastStep);
        this.canExecute = chain.canExecute;
    }

    async execute(...args: any[]) {
        if (typeof this.canExecute === 'boolean' && !this.canExecute) {
            return this.executeLastStep(args);
        }
        if (typeof this.canExecute === 'function' && !this.canExecute(...args)) {
            return this.executeLastStep(args);
        }
        return super.execute(...args);
    }

    private async executeLastStep(args: any[]) {
        return this.lastStep.execute(...args);
    }
}
