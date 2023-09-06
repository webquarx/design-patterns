import IChainOfResponsibilityStep, { TChainOfResponsibility } from './IChainOfResponsibilityStep';
import ChainOfResponsibility from './ChainOfResponsibility';

export default function useChain(chain: TChainOfResponsibility): IChainOfResponsibilityStep {
    return new ChainOfResponsibility(chain);
}
