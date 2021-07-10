import { Signer } from "ethers";
import { Provider } from "@ethersproject/providers";
import type { InitializablePlatformRewardsDistributionRecipient, InitializablePlatformRewardsDistributionRecipientInterface } from "../InitializablePlatformRewardsDistributionRecipient";
export declare class InitializablePlatformRewardsDistributionRecipient__factory {
    static readonly abi: ({
        inputs: any[];
        name: string;
        outputs: {
            internalType: string;
            name: string;
            type: string;
        }[];
        stateMutability: string;
        type: string;
    } | {
        inputs: {
            internalType: string;
            name: string;
            type: string;
        }[];
        name: string;
        outputs: any[];
        stateMutability: string;
        type: string;
    })[];
    static createInterface(): InitializablePlatformRewardsDistributionRecipientInterface;
    static connect(address: string, signerOrProvider: Signer | Provider): InitializablePlatformRewardsDistributionRecipient;
}
