import {Badge, Blockquote, Box, Button, Card, Flex, Spinner, Text, TextField} from "@radix-ui/themes";
import React, {useState} from "react";
import PreViewImage from "@/components/view/previewImage.tsx";
import {useShareManage} from "@/hooks/useShareManage.ts";
import {WalletSelector} from "@aptos-labs/wallet-adapter-ant-design";
import {useWallet} from "@aptos-labs/wallet-adapter-react";

export default function PayView(
    {
        shareFile,
    }) {
    const [isConfirm, setIsConfirm] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const {COIN_AMOUNT, handlePayShareView} = useShareManage();
    const {account} = useWallet();

    const pay4View = async () => {
        // return console.log(shareFile)

        setIsLoading(true)

        try {
            await handlePayShareView(shareFile);
            setIsConfirm(true)
        } catch (e) {
            alert(e)
        }

        setIsLoading(false)
    }
    return (
        <>
            {!isConfirm ?
                <div className="flex h-screen flex-col back-ground">
                    <main className="flex flex-1 justify-center items-center">
                        <Flex direction="column" gap="3">
                            <Card className="preview-form">
                                <Flex direction="column" gap="3">
                                    <Text as="div" weight="bold" size="3" mb="1" align={'center'}>
                                        <img src="/images/logo.png" alt="" style={{height: '50px'}}/>
                                    </Text>
                                    <Text>
                                        In order to support the author in sharing his wonderful works, please
                                        pay <Badge variant="solid" color="orange" size="3">{(shareFile.fee / COIN_AMOUNT).toString()} COIN</Badge> to
                                        view the pictures.
                                    </Text>
                                    <Blockquote color="crimson">
                                        Since this is a testing phase, please connect your wallet to <Badge variant="solid" color="orange" size="3">Testnet</Badge>
                                    </Blockquote>

                                    <WalletSelector/>
                                    {account ?
                                        <>
                                            {isLoading ?
                                                <Button>
                                                    <Spinner loading></Spinner> Waiting Aptos NET response.
                                                </Button> :
                                                <Button onClick={pay4View}>Pay for view</Button>
                                            }
                                        </>
                                        : null}
                                    <Text size="1" align={'center'}>
                                        Version (20241004.test)
                                    </Text>

                                </Flex>
                            </Card>
                        </Flex>
                    </main>
                </div>
                :
                <PreViewImage
                    shareFile={shareFile}
                />
            }
        </>
    )
}