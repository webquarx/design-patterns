import IChainOfResponsibilityStep from './IChainOfResponsibilityStep';

export default abstract class ChainOfResponsibilityStep implements IChainOfResponsibilityStep {
    private nextStep?: IChainOfResponsibilityStep | ChainOfResponsibilityStep;

    setNext(nextStep?: IChainOfResponsibilityStep): IChainOfResponsibilityStep {
        this.nextStep = nextStep;
        return nextStep || this;
    }

    setLast(step: IChainOfResponsibilityStep): IChainOfResponsibilityStep {
        if (this.nextStep && 'setLast' in this.nextStep) {
            this.nextStep.setLast(step);
        } else {
            this.nextStep = step;
        }
        return step;
    }

    async execute(...args: any[]): Promise<any> {
        return await this.executeNext(...args);
    }

    protected async executeNext(...args: any[]): Promise<any> {
        if (this.nextStep) {
            return await this.nextStep.execute(...args);
        }
        return this.getResult(...args);
    }

    // eslint-disable-next-line class-methods-use-this
    private getResult(...args: any[]) {
        if (args.length === 0) {
            return undefined;
        }
        return args.length === 1 ? args[0] : args;
    }
}
