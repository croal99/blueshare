import {Badge, Button, Dialog, Flex, Text, Card, Grid, TextField, Spinner} from "@radix-ui/themes";
import React, {useEffect, useState} from "react";
import copy from "copy-to-clipboard";
import {IFileOnStore} from "@/types/IFileOnStore.ts";
import {Label, Radio} from "flowbite-react";
import {useShareManage} from "@/hooks/useShareManage.ts";
import toast from "react-hot-toast";
import {UpdateShareFile} from "@/hooks/useFileStore.ts";
import {e} from "@aptos-labs/ts-sdk/dist/common/accountAddress-DUCC2ffJ";
import {IStoreOnChain} from "@/types/IFileOnChain.ts";

export default function Share({shareFile}: { shareFile: IFileOnStore, }) {
    const [isLoading, setIsLoading] = useState(false);
    const [step, setStep] = useState(0);
    const [shareType, setShareType] = useState(0);
    const [shareCode, setShareCode] = useState("");
    const [shareFee, setShareFee] = useState<number>(0);
    const [shareURL, setShareURL] = useState("");
    const [currentFile, setCurrentFile] = useState<IFileOnStore>({});
    const [shareDescritioin, setShareDescritioin] = useState('');

    const {COIN_AMOUNT, handleAddFile, handleGetManger} = useShareManage();

    const storeOnChain = async () => {
        // setStep(0);
        // return onChange();
        // const store = await handleGetManger();
        // console.log('store', store);
        // return console.log('storeOnChain', shareFile, shareFee, shareCode);

        if (shareType == 0) {
            toast.error("Please select a sharing type.");
            return;
        }
        setIsLoading(true);

        try {
            // console.log('store on chain', shareFile, shareType);
            const res = await handleAddFile(
                shareFile.name,
                shareFile.media_type,
                shareFile.password,
                shareFile.salt,
                shareFile.blob_id,
                shareType,
                shareFee * COIN_AMOUNT,
                shareCode,
            )
            if (res === true) {
                const store = await handleGetManger();

                if (store) {
                    // update
                    shareFile.share = shareType;
                    shareFile.code = shareCode;
                    shareFile.fee = shareFee * COIN_AMOUNT;
                    shareFile.object_id = store.files.handle.substring(2);
                    await UpdateShareFile(shareFile);
                }
                // currentFile.handle = storeManage.files.handle.substring(2);
                // await updateFileStore(currentFile);
                // reFetch();

                // await showShareLink(currentFile)
            } else {
                toast.error(res);
            }
        } catch (e) {
            alert(e)
        }
        setIsLoading(false)
        setStep(0);
        // onChange();
    }

    const showShareSelect = async (fileInfo: IFileOnStore) => {
        // console.log('share', fileInfo, storeManage)
        setShareType(fileInfo.share);
        setShareCode(fileInfo.code);
        setShareFee(fileInfo.fee / COIN_AMOUNT);

        setStep(1);
    }

    const showShareLink = async (fileInfo: IFileOnStore) => {
        // console.log('share', fileInfo, storeManage)
        let baseUrl = window.location.href.split('#')[0]
        // setShareURL(`${baseUrl}#/view/${fileInfo.object_id}/${fileInfo.blob_id}`)
        setShareURL(`${baseUrl}view/${fileInfo.object_id}/${fileInfo.blob_id}`)

        switch (fileInfo.share) {
            case 1:
                setShareDescritioin("It's Free. Anyone can view the files you share.");
                break;
            case 2:
                setShareDescritioin("Users use the sharing code to view the files you share.");
                break;
            case 3:
                setShareDescritioin("Users need to pay COIN to view the files you share.");
                break;
        }
        setCurrentFile(fileInfo)
        setStep(2)
    }


    // useEffect(() => {
    //     console.log('set share file', shareFile);
    //     setCurrentFile(shareFile);
    // }, []);

    return (
        <>
            <Button
                color={shareFile.share == 0 ? "blue" : "green"} style={{width: 75}}
                onClick={async () => {
                    // console.log('share', shareFile);
                    if (shareFile.share == 0) {
                        await showShareSelect(shareFile);
                    } else {
                        await showShareLink(shareFile);
                    }
                }}>
                {shareFile.share == 0 ? <>Share</> : <>Link</>}
            </Button>

            <Dialog.Root open={step == 1}>
                <Dialog.Content maxWidth="500px">
                    <Dialog.Title>Protect file with Walrus-Share Contract</Dialog.Title>
                    <Dialog.Description>
                    </Dialog.Description>

                    <Flex direction="column" gap="3">
                        <Text>
                            When a user views the file you shared, the user will pay or unlock it according to the
                            sharing method you set.
                        </Text>
                        <Text size="4" weight="bold">Select share method</Text>
                        <Card>
                            <Grid columns="2" gap="3">
                                <Flex gap="2" align="center">
                                    <Radio name="shareType" value={1} defaultChecked={shareType == 1}
                                           disabled={isLoading}
                                           onChange={event => {
                                               setShareType(1);
                                               setShareCode("");
                                               setShareFee(0);
                                           }}/>
                                    <Text as="label" size="2">Free</Text>
                                </Flex>
                                <Flex>
                                </Flex>

                                <Flex gap="2" align="center">
                                    <Radio name="shareType" value={2} defaultChecked={shareType == 2}
                                           disabled={isLoading}
                                           onChange={event => {
                                               setShareType(2);
                                               setShareCode(Math.random().toString(36).substring(2, 6));
                                               setShareFee(0);
                                           }}/>
                                    <Text as="label" size="2">Code</Text>
                                </Flex>
                                <Flex>
                                    <TextField.Root
                                        disabled={(shareType != 2) || isLoading}
                                        defaultValue={shareCode}
                                        onChange={event => {
                                            setShareCode(event.target.value);
                                        }}
                                    />
                                </Flex>

                                <Flex gap="2" align="center">
                                    <Radio name="shareType" value={3} defaultChecked={shareType == 3}
                                           disabled={isLoading}
                                           onChange={event => {
                                               setShareType(3);
                                               setShareCode("");
                                               setShareFee(0.1);
                                           }}
                                    />
                                    <Text as="label" size="2">Pay</Text>
                                </Flex>
                                <Flex align="center" gap="2">
                                    <TextField.Root
                                        disabled={(shareType != 3) || isLoading}
                                        // defaultValue={shareFee}
                                        value={shareFee}
                                        onChange={event => {
                                            setShareFee(parseFloat(event.target.value))
                                            // shareFile.fee = parseFloat(event.target.value) * COIN_AMOUNT
                                        }}
                                    />Coin
                                </Flex>
                            </Grid>


                        </Card>

                        {isLoading ?
                            <Button>
                                <Spinner loading></Spinner> Waiting Aptos NET response.
                            </Button> :
                            <Flex gap="3" mt="4" justify="end">
                                <Button onClick={() => {
                                    setStep(0)
                                }}>Close</Button>
                                <Button
                                    onClick={() => storeOnChain()}
                                    color="red" style={{width: 70}}
                                >
                                    Publish
                                </Button>
                            </Flex>
                        }
                    </Flex>

                </Dialog.Content>
            </Dialog.Root>

            <Dialog.Root open={step == 2}>
                <Dialog.Content maxWidth="550px">
                    <Dialog.Title>Share info of "{shareFile.name}"</Dialog.Title>
                    <Dialog.Description>
                    </Dialog.Description>

                    <Flex direction="column" gap="3">
                        <Flex gap="3"></Flex>
                        <Text>Share URL</Text>
                        <Card>
                            {shareURL}
                        </Card>
                        <Text>Share Type</Text>
                        <Text>{shareDescritioin}</Text>
                        {currentFile.share == 2 ?
                            <Flex align="center" gap="3">
                                <Text>Share Code</Text>
                                <Button>{currentFile.code}</Button>
                            </Flex> : null
                        }
                        {currentFile.share == 3 ?
                            <Flex align="center" gap="3">
                                <Text>Payment</Text>
                                <Button>{(currentFile.fee / COIN_AMOUNT).toString()}</Button>
                                <Text>Coin</Text>
                            </Flex> : null
                        }
                        <Flex gap="3"></Flex>
                        <Flex direction="column" gap="3">
                            <Button
                                onClick={() => {
                                    copy(shareURL);
                                    toast.success('Link copied');
                                    setStep(0)
                                }}
                            >
                                Copy link
                            </Button>
                            <Button variant="surface"
                                    onClick={() => {
                                        setStep(0)
                                    }}
                            >
                                Close
                            </Button>
                        </Flex>
                    </Flex>

                </Dialog.Content>
            </Dialog.Root>
        </>
    )
}