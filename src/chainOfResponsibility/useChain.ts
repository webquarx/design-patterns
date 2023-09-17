import { IConditionalChainOfResponsibility, TChainOfResponsibility } from './IChainOfResponsibilityStep';
import ChainOfResponsibility from './ChainOfResponsibility';
import ConditionalChainOfResponsibility from './ConditionalChainOfResponsibility';
import ChainOfResponsibilityStep from './ChainOfResponsibilityStep';

export default function useChain(chain: TChainOfResponsibility | IConditionalChainOfResponsibility)
    : ChainOfResponsibilityStep {
    if (Array.isArray(chain) || typeof chain === 'function' || 'setNext' in chain) {
        return new ChainOfResponsibility(chain);
    }
    return new ConditionalChainOfResponsibility(chain);
}
