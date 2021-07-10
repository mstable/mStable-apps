import { Signer } from "ethers";
import { Provider } from "@ethersproject/providers";
import type { ICurveMetaPool } from "../ICurveMetaPool";
export declare class ICurveMetaPool__factory {
    static connect(address: string, signerOrProvider: Signer | Provider): ICurveMetaPool;
}
