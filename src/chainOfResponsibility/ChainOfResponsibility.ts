import ChainOfResponsibilityStep from './ChainOfResponsibilityStep';
import IChainOfResponsibilityStep from './IChainOfResponsibilityStep';

export default class ChainOfResponsibility extends ChainOfResponsibilityStep {
    constructor(steps: IChainOfResponsibilityStep[]) {
        super();
        this.createChain(steps);
    }

    private createChain(steps: IChainOfResponsibilityStep[]) {
        for (let i = 0; i < steps.length; i++) {
            const step = i === 0 ? this : steps[i - 1];
            step.setNext(steps[i]);
        }
    }
}
