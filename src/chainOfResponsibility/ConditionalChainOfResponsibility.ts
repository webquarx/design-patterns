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

    async execute(...args: any[]): Promise<any> {
        if (typeof this.canExecute === 'boolean' && !this.canExecute) {
            return await this.executeLastStep(args);
        }
        if (typeof this.canExecute === 'function' && !this.canExecute(...args)) {
            return await this.executeLastStep(args);
        }
        return await super.execute(...args);
    }

    private async executeLastStep(args: any[]): Promise<any> {
        return await this.lastStep.execute(...args);
    }
}
