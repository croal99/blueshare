import {IFileOnStore} from "@/types/IFileOnStore.ts";
import React, {useEffect, useState} from "react";
import axios from "axios";
import {DecryptBlob, EncryptBlobFile, NewShareFile} from "@/hooks/useFileStore.ts";
import {Button, FileInput} from "flowbite-react";

export default function ViewVideo({shareFile}: { shareFile: IFileOnStore }) {
    const [isDownload, setIsDownload] = useState(false);
    const [file, setFile] = useState();
    const [blobUrl, setBlobUrl] = useState('');

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
            console.log(URL.createObjectURL(blob));

            setBlobUrl(URL.createObjectURL(blob));

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

    const download = async () => {
        const txUrl = `${aggregatorURL}/v1/${shareFile.blob_id}`;
        axios.get(txUrl, {responseType: 'arraybuffer'}).then(async (res) => {
            const blob = await DecryptBlob(res.data, shareFile);
            const blobUrl = URL.createObjectURL(blob);

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


            setIsDownload(false);
        })
    }

    const playVideo = async () => {
        const fileInfo = await NewShareFile();

        fileInfo.name = file.name;
        fileInfo.media_type = file.type;
        fileInfo.icon = "pdf";
        fileInfo.size = file.size;
        fileInfo.password = Math.random().toString(36).substring(2, 12);
        fileInfo.salt = fileInfo.id.substring(0, 8);

        const cryptData = await EncryptBlobFile(file, fileInfo);

        const blob = await DecryptBlob(cryptData, fileInfo);
        const blobUrl = URL.createObjectURL(blob);

        const tempLink = document.createElement("a");
        tempLink.href = blobUrl;
        tempLink.setAttribute(
            "download",
            fileInfo.name,
        )
        document.body.appendChild(tempLink);
        tempLink.click();

        document.body.removeChild(tempLink);
        URL.revokeObjectURL(blobUrl);
    }

    return (
        <>
            <div className="back-ground h-screen">

                <FileInput
                    helperText="PDF (MAX SIZE: 10MB)."
                    onChange={e => {
                        // console.log(e.target.files[0])
                        setFile(e.target.files[0])
                    }}
                />
                <Button onClick={download}>Download</Button>
                <Button onClick={playVideo}>PlayVideo</Button>
                {!isDownload && (
                    <video width="320" height="540" controls="controls" id="video" preload="auto">
                        <source src={blobUrl} type="video/mp4"/>
                    </video>
                )}
            </div>
        </>
    )
}