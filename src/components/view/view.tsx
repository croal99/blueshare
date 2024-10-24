import {useLoaderData} from "react-router-dom";
import {GetShareFile} from "@/hooks/useFileStore.ts";
import {useEffect, useState} from "react";
import {useShareManage} from "@/hooks/useShareManage.ts";
import {Button, Spinner} from "@radix-ui/themes";
import CodeView from "@/components/view/codeview.tsx";
import PayView from "@/components/view/payview.tsx";
import {IFileInfoOnChain} from "@/types/IFileOnChain.ts";
import PreViewImage from "@components/view/previewImage.tsx";
import ViewVideo from "@components/view/viewVideo.tsx";

// import PayView from "@/components/view/payview.tsx";


export async function loader({params}) {
    const handle = params.handle;
    const id = params.id;
    return {handle, id};
}

export default function View() {
    const {handle, id} = useLoaderData();
    const [shareFile, setShareFile] = useState<IFileInfoOnChain | null>(null);
    const {handleGetShareFileObject} = useShareManage();

    const fetchData = async () => {
        // const fileObject = await handleGetShareFileObject(handle, id);
        const fileObject = await GetShareFile(id);
        console.log('fetch data', fileObject);
        // fileObject.share = parseInt(String(fileObject.share))
        setShareFile(fileObject);
    };

    useEffect(() => {
        fetchData().then(() => {
            // console.log('end fetch');
        });

        return () => {
        }
    }, []);

    switch (shareFile?.share) {
        case 0:
            return (
                <PreViewImage
                    shareFile={shareFile}
                />
            )

        case 1:
            return (
                <ViewVideo
                    shareFile={shareFile}
                />
            )

        case 2:
            return (
                <CodeView
                    shareFile={shareFile}
                />
            )

        case 3:
            return (
                <PayView
                    shareFile={shareFile}
                />
            )
    }


    return (
        <>
            <div className="flex h-screen flex-col back-ground">
                <main className="flex flex-1 justify-center items-center">
                    <Button>
                        <Spinner loading></Spinner> Loading...
                    </Button>
                </main>
            </div>
        </>
    )
}