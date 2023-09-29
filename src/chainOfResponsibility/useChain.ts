import { TChainOfResponsibility } from './IChainOfResponsibilityStep';
import ChainOfResponsibility from './ChainOfResponsibility';
import ChainOfResponsibilityStep from './ChainOfResponsibilityStep';

export default function useChain(chain: TChainOfResponsibility): ChainOfResponsibilityStep {
    return new ChainOfResponsibility(chain);
}
