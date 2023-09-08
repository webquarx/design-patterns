import IChainOfResponsibilityStep from './IChainOfResponsibilityStep';

export default abstract class ChainOfResponsibilityStep implements IChainOfResponsibilityStep {
    private nextStep?: IChainOfResponsibilityStep;

    setNext(nextStep?: IChainOfResponsibilityStep): IChainOfResponsibilityStep {
        this.appendStep(nextStep);
        return nextStep || this;
    }

    private appendStep(nextStep?: IChainOfResponsibilityStep): void {
        if (!nextStep || !this.nextStep) {
            this.nextStep = nextStep;
            return;
        }
        this.nextStep.setNext(nextStep);
    }

    async execute(...args: any[]): Promise<any> {
        if (this.nextStep) {
            return await this.nextStep.execute(...args);
        }
        return args;
    }
}
