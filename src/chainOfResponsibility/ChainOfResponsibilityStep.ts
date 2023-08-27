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

    async execute(...args: any[]) {
        if (this.nextStep) {
            return this.nextStep.execute(...args);
        }
        return args;
    }
}
