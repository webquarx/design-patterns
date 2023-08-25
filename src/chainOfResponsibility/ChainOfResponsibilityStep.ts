import IChainOfResponsibilityStep from './IChainOfResponsibilityStep';

export default abstract class ChainOfResponsibilityStep implements IChainOfResponsibilityStep {
    private nextStep?: IChainOfResponsibilityStep;

    setNext(nextStep: IChainOfResponsibilityStep): IChainOfResponsibilityStep {
        this.nextStep = nextStep;
        return nextStep;
    }

    async execute(...args: any[]) {
        if (this.nextStep) {
            return this.nextStep.execute(...args);
        }
        return args;
    }
}
