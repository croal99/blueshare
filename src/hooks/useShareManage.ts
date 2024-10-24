import {IFileInfoOnChain, IStoreOnChain} from "@/types/IFileOnChain.ts";
import {Aptos, APTOS_COIN, AptosConfig} from "@aptos-labs/ts-sdk";
import {InputTransactionData, useWallet} from "@aptos-labs/wallet-adapter-react";

// Setup the client
const config = new AptosConfig({network: "testnet"});
const aptos = new Aptos(config);

export const useShareManage = () => {
    const {account, signAndSubmitTransaction} = useWallet();

    const COIN_AMOUNT = 100_000_000;

    // 配置信息
    const env = import.meta.env;
    const MANAGE_ADDRESS = env.VITE_MODULE_ADDRESS;

    const handleGetManger = async () => {
        if (!account) return false;
        // console.log("account", account);
        try {
            const listResource = await aptos.getAccountResource(
                {
                    accountAddress: account?.address,
                    resourceType: `${MANAGE_ADDRESS}::sharelist::FileStore`
                }
            );
            // console.log('file store', listResource as IStoreOnChain);
            return listResource as IStoreOnChain
        } catch (err) {
            // console.log('error', err)
            return false;
        }
    }

    const handleCreateManager = async () => {
        const transaction: InputTransactionData = {
            data: {
                function: `${MANAGE_ADDRESS}::sharelist::create_store`,
                functionArguments: []
            }
        }

        try {
            // sign and submit transaction to chain
            const response = await signAndSubmitTransaction(transaction);
            // wait for transaction
             await aptos.waitForTransaction({transactionHash: response.hash});
        } catch (error) {
            console.log(error);
        }

    }

    const handleAddFile = async (
        filename,
        media,
        hash,
        salt,
        blobId,
        share,
        fee,
        code
    ) => {
        const transaction: InputTransactionData = {
            data: {
                function: `${MANAGE_ADDRESS}::sharelist::add_file`,
                functionArguments: [
                    filename,
                    media,
                    hash,
                    salt,
                    blobId,
                    share,
                    fee,
                    code,
                ]
            }
        }

        try {
            // sign and submit transaction to chain
            const response = await signAndSubmitTransaction(transaction);
            // wait for transaction
            const res = await aptos.waitForTransaction({transactionHash: response.hash});
            console.log('res', res);
            return true;
        } catch (error) {
            console.log(error);
            return error
        }
    }

    const handleGetShareFileObject = async (handle: string, blobId: string) => {
        // console.log('handleGetShareFileObject', MANAGE_ADDRESS, handle.substring(0,2), blobId);
        if (handle.substring(0,2) != '0x') {
            handle = '0x' + handle;
        }
        const tableItem = {
            key_type: "0x1::string::String",
            value_type: `${MANAGE_ADDRESS}::sharelist::FileInfo`,
            key: `${blobId}`,
        };
        const fileInfo = await aptos.getTableItem<IFileInfoOnChain>({handle: handle, data: tableItem});

        return fileInfo;

    }

    const handlePayShareView = async (shareFile: IFileInfoOnChain) => {
        const transaction: InputTransactionData = {
            data: {
                function: "0x1::aptos_account::transfer_coins",
                typeArguments: [APTOS_COIN],
                functionArguments: [shareFile.owner, shareFile.fee]
            }
        }

        // sign and submit transaction to chain
        const response = await signAndSubmitTransaction(transaction);
        // wait for transaction
        await aptos.waitForTransaction({transactionHash: response.hash});

    }

    return {
        COIN_AMOUNT,
        handleGetManger,
        handleCreateManager,
        handleAddFile,
        handleGetShareFileObject,
        handlePayShareView,
    }
}