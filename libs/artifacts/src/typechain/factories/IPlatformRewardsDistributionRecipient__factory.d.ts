import { Signer } from "ethers";
import { Provider } from "@ethersproject/providers";
import type { IPlatformRewardsDistributionRecipient, IPlatformRewardsDistributionRecipientInterface } from "../IPlatformRewardsDistributionRecipient";
export declare class IPlatformRewardsDistributionRecipient__factory {
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
    static createInterface(): IPlatformRewardsDistributionRecipientInterface;
    static connect(address: string, signerOrProvider: Signer | Provider): IPlatformRewardsDistributionRecipient;
}
