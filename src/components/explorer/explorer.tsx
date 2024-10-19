import {
    Button,
    Card,
    Flex,
    Text,
    Dialog,
    Table,
    Strong,
} from "@radix-ui/themes";
import UploadFile from "@components/explorer/uploadFile.tsx";
import {useEffect, useState} from "react";
import {DeleteShareFile, getChildFiles} from "@/hooks/useFileStore.ts";
import {IFileOnStore} from "@/types/IFileOnStore.ts";
import dayjs from "dayjs";
import {humanFileSize} from "@/utils/formatSize.ts";
import toast from "react-hot-toast";
import Detail from "@components/explorer/detail.tsx";
import Share from "@components/explorer/share.tsx";

export default function Explorer() {
    const [fileList, setFileList] = useState<IFileOnStore[]>([]);

    const handleDeleteFile = async (file: IFileOnStore) => {
        await DeleteShareFile(file.id);
        toast.success("File successfully deleted.");
        await fetchData();
    }

    const fetchData = async () => {
        const list = await getChildFiles("");
        // console.log("list", list);

        setFileList(list);
    }

    useEffect(() => {
        fetchData().then();
    }, []);

    return (
        <>
            <div className="main-container">
                <div className="grid grid-cols-1 gap-3 mb-4">
                    <div className="flex justify-end gap-3">
                        <UploadFile
                            onUpload={fetchData}
                        />
                    </div>
                    <Card style={{background: 'var(--gray-a6)'}}>
                        <Table.Root>
                            <Table.Header>
                                <Table.Row>
                                    <Table.ColumnHeaderCell>Name</Table.ColumnHeaderCell>
                                    <Table.ColumnHeaderCell>Create</Table.ColumnHeaderCell>
                                    <Table.ColumnHeaderCell>Size</Table.ColumnHeaderCell>
                                    <Table.ColumnHeaderCell></Table.ColumnHeaderCell>
                                </Table.Row>
                            </Table.Header>

                            <Table.Body>
                                {fileList.map((item, index) => (
                                    <Table.Row key={index} align="center">
                                        <Table.RowHeaderCell>
                                            <Flex align="center" gap="2">
                                                <img src={`/images/${item.icon}`} alt="" style={{height: '32px'}}/>
                                                {item.name}
                                            </Flex>
                                        </Table.RowHeaderCell>
                                        <Table.Cell
                                            style={{width: 250}}>{dayjs(item.create_at).format('YYYY/MM/DD HH:mm:ss')}</Table.Cell>
                                        <Table.Cell style={{width: 150}}>{humanFileSize(item.size)}</Table.Cell>
                                        <Table.Cell style={{width: 100}}>
                                            <Flex gap="3">
                                                <Dialog.Root>
                                                    <Dialog.Trigger>
                                                        <Button color="red" style={{width: 75}}>Delete</Button>
                                                    </Dialog.Trigger>

                                                    <Dialog.Content maxWidth="450px">
                                                        <Dialog.Title>Delete File</Dialog.Title>
                                                        <Dialog.Description size="2" mb="4">
                                                        </Dialog.Description>

                                                        <Flex direction="column" gap="3">
                                                            <Text size="3">
                                                                Are you sure you want to delete the file:
                                                            </Text>
                                                            <Text size="3" mb="1" weight="bold">
                                                                <Strong>{item.name}</Strong>
                                                            </Text>

                                                        </Flex>

                                                        <Flex gap="3" mt="4" justify="end">
                                                            <Dialog.Close>
                                                                <Button variant="soft" color="gray">
                                                                    Cancel
                                                                </Button>
                                                            </Dialog.Close>
                                                            <Dialog.Close>
                                                                <Button
                                                                    color="red"
                                                                    onClick={() => handleDeleteFile(item)}
                                                                >
                                                                    Delete
                                                                </Button>
                                                            </Dialog.Close>
                                                        </Flex>
                                                    </Dialog.Content>
                                                </Dialog.Root>

                                                <Detail
                                                    walrusFile={item}
                                                />

                                                <Share
                                                    />
                                            </Flex>


                                        </Table.Cell>
                                    </Table.Row>
                                ))}

                            </Table.Body>
                        </Table.Root>

                    </Card>

                    <div className="flex items-center justify-center h-24 rounded bg-gray-50 dark:bg-gray-800">
                        <p className="text-2xl text-gray-400 dark:text-gray-500">
                            <svg className="w-3.5 h-3.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"
                                 fill="none" viewBox="0 0 18 18">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                      d="M9 1v16M1 9h16"/>
                            </svg>
                        </p>
                    </div>
                    <div className="flex items-center justify-center h-24 rounded bg-gray-50 dark:bg-gray-800">
                        <p className="text-2xl text-gray-400 dark:text-gray-500">
                            <svg className="w-3.5 h-3.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"
                                 fill="none" viewBox="0 0 18 18">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                      d="M9 1v16M1 9h16"/>
                            </svg>
                        </p>
                    </div>
                </div>
            </div>


        </>
    )
}