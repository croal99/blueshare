import {Blockquote, Box, Button, Card, Dialog, Flex, Progress, Spinner, Strong, Text} from "@radix-ui/themes";
import {Form} from "react-router-dom";
import React, {useEffect, useState} from "react";
import {getSetting} from "@/hooks/useLocalStore.ts";
import {IBlobOnWalrus, NewBlobOnWalrus} from "@/types/IBlobOnWalrus.ts";
import {IFileOnStore} from "@/types/IFileOnStore.ts";
import {createFile, EncryptBlobFile, NewShareFile, UpdateShareFile, UploadShareFile} from "@/hooks/useFileStore.ts";
import axios from 'axios';
import {toast} from "react-hot-toast";
import { FileInput, Label } from "flowbite-react";

// import "@/styles/toast.css";


export default function UploadFile(
    {
        root,
        reFetchDir,
        uploadStep,
    }) {
    const [file, setFile] = useState();
    const [step, setStep] = useState(0);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [isError, setIsError] = React.useState(false);
    const [isWarning, setIsWarning] = React.useState(false);
    const [message, setMessage] = React.useState("");

    const handleSubmit = async () => {
        try {
            const fileInfo = await NewShareFile();

            fileInfo.name = file.name;
            fileInfo.media_type = file.type;
            fileInfo.icon = "pdf";
            fileInfo.size = file.size;
            fileInfo.password = Math.random().toString(36).substring(2, 12);

            // console.log("pre encrypt", fileInfo);
            setUploadProgress(0);

            toast.loading('encrypt...')
            const cryptData = await EncryptBlobFile(file, fileInfo);
            if (!cryptData) {
                setUploadProgress(0);
                setStep(0);
                return
            }
            await new Promise((r) => setTimeout(r, 1000)); // fake delay
            toast.dismiss();

            // 准备上传
            setStep(2);
            const config = {
                headers: {
                    'content-type': 'multipart/form-data',
                },
                onUploadProgress: function (progressEvent: { loaded: number; total: number; }) {
                    const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    setUploadProgress(percentCompleted);
                }
            };

            await UploadShareFile(cryptData, fileInfo, config);

            // UI
            setUploadProgress(0);
            setStep(0);
        } catch (err) {
            setUploadProgress(0);
            setStep(0);
            toast.error('Please check your network configuration and make sure the Walrus service address is correct.');
            setIsError(true)
        }
    }

    useEffect(() => {
        setStep(uploadStep)

        return () => {
        }
    }, [uploadStep]);

    return (
        <>
            <Button onClick={() => {
                setStep(1)
            }}>Upload PDF</Button>

            <Dialog.Root open={step == 1}>
                <Dialog.Content maxWidth="550px">
                    <Dialog.Title>Step 1: ENCRYPT file</Dialog.Title>
                    <Dialog.Description size="2" mb="4">
                    </Dialog.Description>

                    <Flex direction="column" gap="3">
                        <Text>
                            Blue Share uses javascript running within your web browser to encrypt and decrypt
                            files client-side, in-browser. This App makes no network connections during
                            this
                            process, to ensure that your keys never leave the web browser during
                            the
                            process.
                        </Text>
                        <Text>
                            All client-side cryptography is implemented using the Web Crypto API. Files
                            are encrypted using AES-CBC 256-bit symmetric encryption. The encryption key is
                            derived from the password and a random salt using PBKDF2 derivation with 10000
                            iterations of SHA256 hashing.
                        </Text>
                        <div>
                            <div>
                                <Label htmlFor="file-upload-helper-text" value="Upload file"/>
                            </div>
                            <FileInput
                                helperText="PDF (MAX SIZE: 10MB)."
                                onChange={e=>{
                                    // console.log(e.target.files[0])
                                    setFile(e.target.files[0])
                                }}
                            />
                        </div>
                        <Button onClick={handleSubmit}>ENCRYPT</Button>
                        <Button variant="soft" onClick={() => {
                            setStep(0)
                        }}>Cancel</Button>
                    </Flex>
                </Dialog.Content>
            </Dialog.Root>

            <Dialog.Root open={step == 2}>
                <Dialog.Content maxWidth="550px">
                    <Dialog.Title>Step 2: Upload encrypted files to Walrus Disk</Dialog.Title>
                    <Dialog.Description size="2" mb="4">
                    </Dialog.Description>

                    <Flex direction="column" gap="3">
                        {isWarning ?
                            <Card style={{background: 'var(--gray-a6)'}}>
                                <Flex direction="column" gap="3">
                                    <Text>
                                        The Walrus system provides an interface that can be used for public testing. For
                                        your
                                        convenience, walrus provide these at the following hosts:
                                    </Text>
                                    <Text>
                                        <Text weight="bold">Aggregator:</Text> https://aggregator-devnet.walrus.space
                                    </Text>
                                    <Text>
                                        <Text weight="bold">Publisher:</Text> https://publisher-devnet.walrus.space
                                    </Text>
                                    <Text color="red">
                                        Walrus publisher is currently limiting requests to <Strong>10 MiB</Strong>. If
                                        you want
                                        to upload larger
                                        files, you need to run your own publisher.
                                    </Text>
                                </Flex>
                            </Card> : null}
                        {uploadProgress < 100 ?
                            <Progress value={uploadProgress} style={{height:'32px'}}></Progress> :
                            <Button>
                                <Spinner loading></Spinner> Waiting Walrus response.
                            </Button>}
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