import { Signer } from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";
import { ContractFactory, Overrides } from "@ethersproject/contracts";
import type { MockCurveMetaPool } from "../MockCurveMetaPool";
export declare class MockCurveMetaPool__factory extends ContractFactory {
    constructor(signer?: Signer);
    deploy(_coins: string[], _mUSD: string, overrides?: Overrides): Promise<MockCurveMetaPool>;
    getDeployTransaction(_coins: string[], _mUSD: string, overrides?: Overrides): TransactionRequest;
    attach(address: string): MockCurveMetaPool;
    connect(signer: Signer): MockCurveMetaPool__factory;
    static connect(address: string, signerOrProvider: Signer | Provider): MockCurveMetaPool;
}
