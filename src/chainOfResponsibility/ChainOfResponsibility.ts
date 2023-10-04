import ChainOfResponsibilityStep from './ChainOfResponsibilityStep';
import { TChainOfResponsibility } from './IChainOfResponsibilityStep';
import ChainOfResponsibilityFactory from './ChainOfResponsibilityFactory';

export default class ChainOfResponsibility extends ChainOfResponsibilityStep {
    constructor(steps: TChainOfResponsibility) {
        super();
        this.createChain(steps);
    }

    private createChain(steps: TChainOfResponsibility) {
        const chain = new ChainOfResponsibilityFactory().createChain(steps);
        if (!chain) {
            return;
        }
        this.setNext(chain);
    }
}
