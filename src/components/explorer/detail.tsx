import {Button, Dialog, Flex, Spinner, Strong, Text} from "@radix-ui/themes";
import React, {useEffect, useState} from "react";
import dayjs from "dayjs";
import {DecryptBlob, WALRUS_SETTING} from "@/hooks/useFileStore.ts";
import axios from "axios";
import BlobImage from "@/components/explorer/blobImage.tsx";
import {humanFileSize} from "@/utils/formatSize.ts";
import {IFileOnStore} from "@/types/IFileOnStore.ts";

export default function Detail({shareFile} : {shareFile: IFileOnStore}) {
    const [isDownload, setIsDownload] = useState(false);
    const [imageUrl, setImageUrl] = useState('');
    const [isError, setIsError] = React.useState(false);
    const [message, setMessage] = React.useState("");

    const handleDownload = async (view: boolean) => {
        // return console.log('download', shareFile);

        setIsDownload(true);
        // await new Promise((r) => setTimeout(r, 500)); // fake delay

        const txUrl = `${WALRUS_SETTING.aggregator}/v1/${shareFile.blob_id}`;
        axios.get(txUrl, { responseType: 'arraybuffer' }).then(async (res) => {
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
            setMessage('Please check your network configuration and make sure the Walrus service address is correct.');
            setIsError(true)
            setIsDownload(false);
        })
    }

    useEffect(() => {
        // console.log('detail');
        setIsDownload(false);
        setImageUrl("");

    }, [shareFile]);

    return (
        <>
            <Dialog.Root>
                <Dialog.Trigger>
                    <Button style={{width:75}}>Detail</Button>
                </Dialog.Trigger>

                <Dialog.Content maxWidth="600px">
                    <Dialog.Title>{shareFile.name}</Dialog.Title>
                    <Dialog.Description size="2" mb="4">
                    </Dialog.Description>


                    <Flex direction="column" gap="3">
                        <Text><Strong>type: </Strong>{shareFile.media_type}</Text>
                        <Text><Strong>blobId: </Strong>{shareFile.blob_id}</Text>
                        <Text><Strong>size: </Strong>{humanFileSize(shareFile.size)}</Text>
                        <Text><Strong>create at: </Strong>{dayjs(shareFile.create_at).format('YYYY/MM/DD HH:mm:ss')}
                        </Text>
                        {shareFile.media_type.indexOf("image") != -1 ?
                            <BlobImage
                                imageUrl={imageUrl}
                                isDownload={isDownload}
                                handleDownload={handleDownload}
                            />
                            : null}
                        <Button disabled={isDownload} onClick={() => handleDownload(false)}>
                            <Spinner loading={isDownload}></Spinner> Download
                        </Button>
                    </Flex>

                </Dialog.Content>
            </Dialog.Root>

            <Dialog.Root open={isError}>
                <Dialog.Content maxWidth="450px">
                    <Dialog.Title>Network Error</Dialog.Title>
                    <Dialog.Description size="2" mb="4">
                    </Dialog.Description>

                    <Flex direction="column" gap="3">
                        <Text>
                            {message}
                        </Text>

                        <Flex gap="3" mt="4" justify="end">
                            <Dialog.Close>
                                <Button onClick={() => {
                                    setIsError(false)
                                }}>Close</Button>
                            </Dialog.Close>
                        </Flex>

                    </Flex>

                </Dialog.Content>
            </Dialog.Root>

        </>
    )

}