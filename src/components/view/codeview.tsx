import {Box, Button, Card, Flex, Text, TextField} from "@radix-ui/themes";
import React, {useState} from "react";
import PreViewImage from "@/components/view/previewImage.tsx";
import {toast, Toaster} from "react-hot-toast";

export default function CodeView(
    {
        shareFile,
    }) {
    const [shareCode, setShareCode] = useState("");
    const [isConfirm, setIsConfirm] = useState(false);

    const checkShareCode = async () => {
        if (shareCode == shareFile.code) {
            // console.log('confirm')
            setIsConfirm(true)
            // await handleDownload(shareFile, true)
        } else {
            toast.error('error code')
        }
    }
    return (
        <>
            <Toaster />
            {!isConfirm ?
                <div className="back-ground h-screen">
                    <Box className="login-container">
                        <Flex direction="column" gap="3">
                            <Card className="preview-form">
                                <Flex direction="column" gap="3">
                                    <Text as="div" weight="bold" size="3" mb="1" align={'center'}>
                                        <img src="/images/logo.png" alt="" style={{height: '50px'}}/>
                                    </Text>
                                    <Text>
                                        In order to support the author in sharing his wonderful works, please
                                        enter the share code to view the pictures.
                                    </Text>
                                    <TextField.Root
                                        style={{width: "100%"}}
                                        onChange={event => {
                                            setShareCode(event.target.value)
                                        }}
                                    />
                                    <Button onClick={checkShareCode}>View</Button>
                                    <Text size="1" align={'center'}>
                                        Version (20241004.test)
                                    </Text>

                                </Flex>
                            </Card>
                        </Flex>
                    </Box>
                </div>
                :
                <PreViewImage
                    shareFile={shareFile}
                />
            }
        </>
    )
}