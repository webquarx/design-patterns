import ChainOfResponsibilityStep from './ChainOfResponsibilityStep';

export default class ChainOfResponsibility extends ChainOfResponsibilityStep {
    constructor(steps: ChainOfResponsibilityStep[]) {
        super();
        this.createChain(steps);
    }

    private createChain(steps: ChainOfResponsibilityStep[]) {
        for (let i = 0; i < steps.length; i++) {
            const step = i === 0 ? this : steps[i - 1];
            step.setNext(steps[i]);
        }
    }
}
