import IChainOfResponsibilityStep, { IConditionalChainOfResponsibility, TChainOfResponsibility } from './IChainOfResponsibilityStep';
import ChainOfResponsibility from './ChainOfResponsibility';
import ConditionalChainOfResponsibility from './ConditionalChainOfResponsibility';

export default function useChain(chain: TChainOfResponsibility | IConditionalChainOfResponsibility)
    : IChainOfResponsibilityStep {
    if (Array.isArray(chain) || typeof chain === 'function' || 'setNext' in chain) {
        return new ChainOfResponsibility(chain);
    }
    return new ConditionalChainOfResponsibility(chain);
}
