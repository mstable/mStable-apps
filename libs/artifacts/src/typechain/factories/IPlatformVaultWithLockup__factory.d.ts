import { Signer } from "ethers";
import { Provider } from "@ethersproject/providers";
import type { IPlatformVaultWithLockup, IPlatformVaultWithLockupInterface } from "../IPlatformVaultWithLockup";
export declare class IPlatformVaultWithLockup__factory {
    static readonly abi: {
        inputs: {
            internalType: string;
            name: string;
            type: string;
        }[];
        name: string;
        outputs: {
            internalType: string;
            name: string;
            type: string;
        }[];
        stateMutability: string;
        type: string;
    }[];
    static createInterface(): IPlatformVaultWithLockupInterface;
    static connect(address: string, signerOrProvider: Signer | Provider): IPlatformVaultWithLockup;
}
