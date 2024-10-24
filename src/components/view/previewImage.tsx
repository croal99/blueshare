import React, {useEffect, useState} from "react";
import {Box, Button, Flex, Grid, Heading, Spinner} from "@radix-ui/themes";
import {ConnectButton} from "@mysten/dapp-kit";

import axios from "axios";
import {Link} from "react-router-dom";
import {IFileOnStore} from "@/types/IFileOnStore.ts";
import {DecryptBlob} from "@/hooks/useFileStore.ts";

export default function PreViewImage({shareFile}:{shareFile: IFileOnStore}) {
    const [isDownload, setIsDownload] = useState(false);
    const [imageUrl, setImageUrl] = useState('');

    const aggregatorURL = "https://aggregator-devnet.walrus.space"

    const handleDownload = async (view: boolean) => {
        // return console.log('download', shareFile, view);
        if (!shareFile) {
            return
        }

        setIsDownload(true);

        const txUrl = `${aggregatorURL}/v1/${shareFile.blob_id}`;
        axios.get(txUrl, {responseType: 'arraybuffer'}).then(async (res) => {
            const blob = await DecryptBlob(res.data, shareFile);
            const blobUrl = URL.createObjectURL(blob);

            if (!view) {
                const tempLink = document.createElement("a");
                tempLink.href = blobUrl;
                tempLink.setAttribute(
                    "download",
                    shareFile.name,
                )
                document.body.appendChild(tempLink);
                tempLink.click();

                document.body.removeChild(tempLink);
                URL.revokeObjectURL(blobUrl);
            } else {
                setImageUrl(blobUrl);
            }

            setIsDownload(false);
        }).catch(error => {
            console.log('store error', error)
            // setMessage('Please check your network configuration and make sure the Walrus service address is correct.');
            // setIsError(true)
            setIsDownload(false);
        })
    }

    const fetchData = async () => {
        await handleDownload(true)
    }

    useEffect(() => {
        fetchData().then(() => {
            // console.log('end fetch');
        });

        return () => {
        }
    }, [shareFile]);

    return (
        <>
            <div className="back-ground h-screen">
                <Flex direction="column" gap="4" p="4">
                    <Box>
                        <Grid columns="2" align="center">
                            <Heading><Link to="/" style={{textDecoration: 'none'}}><img src="/images/logo.png" alt=""
                                                                                        style={{height: '50px'}}/></Link></Heading>
                            <Flex justify="end" className="header">
                            </Flex>
                        </Grid>
                    </Box>

                    <Flex>
                    </Flex>

                    <Flex className="preview-container" gap="4">

                        {isDownload ?
                            <Button>
                                <Spinner loading={isDownload}></Spinner> Loading...
                            </Button> :
                            <>
                                <Button disabled={isDownload} onClick={() => handleDownload(shareFile, false)}>
                                    <Spinner loading={isDownload}></Spinner> Download
                                </Button>
                                <Flex justify="center">
                                    <img src={imageUrl} alt="" style={{maxHeight: '70vh'}}/>
                                </Flex>
                            </>
                        }
                    </Flex>
                </Flex>
            </div>
        </>
    )
}