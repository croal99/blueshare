import localforage from "localforage";
import {matchSorter} from "match-sorter";
import {IBlobOnWalrus, INewBlobOnWalrus} from "@/types/IBlobOnWalrus.ts";
import {IFileOnStore} from "@/types/IFileOnStore.ts";
import {toast} from "react-hot-toast";
import Api from "@/utils/api.ts";
import axios, {AxiosRequestConfig} from "axios";

const KEY_FILE = "files";
const iconType = ["image", "pdf", "zip", "video", "audio"];
const iconFile = ["image.png", "pdf.png", "zip.png", "video.png", "audio.png"];
const setting = {
    aggregator: "https://aggregator-devnet.walrus.space",
    publisher: "https://publisher-devnet.walrus.space",
}

const readfile = (file: Blob ) => {
    return new Promise((resolve, reject) => {
        const fr = new FileReader();
        fr.onload = () => {
            resolve(fr.result)
        };
        fr.readAsArrayBuffer(file);
    });
}

export const NewShareFile = async () => {
    const res = await Api.get("walrus/new");
    // console.log(res);
    return res.data as IFileOnStore;
}

export const UpdateShareFile = async (fileInfo: IFileOnStore) => {
    const res = await Api.post("walrus/file", fileInfo);
    // console.log(res);
}

export const UploadShareFile = (data: Uint8Array, fileInfo: IFileOnStore, config: AxiosRequestConfig) => {
    const publisherUrl = `${setting.publisher}/v1/store?epochs=1`;

    return new Promise((resolve, reject) => {
        axios.put(publisherUrl, data, config).then(response => {
            // console.log('store', response)
            let blobId: string;

            if (response.data.alreadyCertified) {
                blobId = (response.data.alreadyCertified as IBlobOnWalrus).blobId
                toast.success("This file has already been uploaded")
            } else if (response.data.newlyCreated) {
                blobId = (response.data.newlyCreated as INewBlobOnWalrus).blobObject.blobId
                toast.success("Walrus file created successfully")
            } else {

                reject("Walrus's response is error.");
            }

            fileInfo.id = blobId;
            fileInfo.blob_id = blobId;
            fileInfo.create_at = Date.now();
            UpdateShareFile(fileInfo).then(res => {
                resolve(res);
            });
            // console.log('new file', fileInfo);

        }).catch(error => {
            reject(error);
        })
    })
}

export const EncryptBlobFile = async (file: Blob, fileInfo: IFileOnStore) => {
    // console.log(file);
    if (file.type.indexOf('pdf') == -1) {
        toast.error('This file is not a PDF file.');
        return false;
    }

    const blob = await readfile(file).catch(function (err) {
        toast.error(err);
        return false;
    });

    const plaintextbytes = new Uint8Array(blob);
    const pbkdf2iterations = 10000;
    const passphrasebytes = new TextEncoder().encode(fileInfo.password);
    const pbkdf2salt = new TextEncoder().encode(fileInfo.salt);

    const passphrasekey = await window.crypto.subtle.importKey(
        'raw',
        passphrasebytes,
        {name: 'PBKDF2'},
        false,
        ['deriveBits']
    ).catch(function (err) {
        toast.error(err);
        return false;
    });

    let pbkdf2bytes = await window.crypto.subtle.deriveBits(
        {
            "name": 'PBKDF2',
            "salt": pbkdf2salt,
            "iterations": pbkdf2iterations,
            "hash": 'SHA-256'
        },
        passphrasekey as CryptoKey,
        384
    ).catch(function (err) {
        toast.error(err);
        return false;
    });

    pbkdf2bytes = new Uint8Array(pbkdf2bytes);

    let keybytes = pbkdf2bytes.slice(0, 32);
    let ivbytes = pbkdf2bytes.slice(32);

    const key = await window.crypto.subtle.importKey(
        'raw',
        keybytes,
        {
            name: 'AES-CBC',
            length: 256
        },
        false,
        ['encrypt']
    ).catch(function (err) {
        toast.error(err);
        return false;
    });

    let cipherbytes = await window.crypto.subtle.encrypt(
        {
            name: "AES-CBC",
            iv: ivbytes
        },
        key as CryptoKey,
        plaintextbytes
    ).catch(function (err) {
        toast.error(err);
        return false;
    });

    cipherbytes = new Uint8Array(cipherbytes);
    const resultbytes = new Uint8Array(cipherbytes.length + 16);
    resultbytes.set(new TextEncoder().encode('Salted__'));
    resultbytes.set(pbkdf2salt, 8);
    resultbytes.set(cipherbytes, 16);

    return resultbytes;
}

// ------ File Api ------

export async function getAllFiles() {
    const files: IFileOnStore[] | null = await localforage.getItem(KEY_FILE);
    if (files) {
        return files
    } else {
        return [];
    }
}

export async function getChildFiles(parentId) {
    // console.log('current child folders', folderId);
    const res = await Api.get("walrus/filelist");


    const files: IFileOnStore[] = res.data as IFileOnStore[];
    if (!files) {
        return []
    }
    // console.log(files);

    // return ;
    if (parentId) {
        const list = matchSorter(files, parentId, {keys: ["parentId"]});
        for (const index in list) {
            list[index].icon = "default.png";
            for (const key in iconType) {
                if (list[index].media_type.indexOf(iconType[key]) != -1) {
                    // console.log('find', key, iconType[key]);
                    list[index].icon = iconFile[key];
                    break;
                }
            }
        }

        return list;
    }
    return files;
}

export async function getFilesByType(mediaType) {
    const files: IFileOnStore[] | null = await localforage.getItem(KEY_FILE);
    if (!files) {
        return []
    }

    if (mediaType.length == 0) {
        return [];
    }

    const list = matchSorter(files, mediaType, {keys: ["mediaType"]});
    for (const index in list) {
        list[index].icon = "default.png";
        for (const key in iconType) {
            if (list[index].mediaType.indexOf(iconType[key]) != -1) {
                // console.log('find', key, iconType[key]);
                list[index].icon = iconFile[key];
                break;
            }
        }
    }

    return list;
}

export async function getFileByID(id) {
    const files = await getAllFiles();

    for (let i = 0; i < files.length; i++) {
        if (files[i].id === id ) {
            return files[i];
        }
    }

    return false;
}

export async function getFileByBlobID(blobId) {
    const files = await getAllFiles();

    for (let i = 0; i < files.length; i++) {
        if (files[i].blobId === blobId ) {
            return files[i];
        }
    }

    return false;
}

export async function checkFileIsExist(newFile: IFileOnStore) {
    const folders = await getChildFiles(newFile.parentId);

    // 检查是否已经创建
    const match = matchSorter(folders, newFile.blobId, {keys: ["blobId"]});
    // console.log('checkFileIsExist', match, newFile);
    return match.length > 0
}

export async function createFile(newFile: IFileOnStore) {
    // 检查是否已经创建
    if (await checkFileIsExist(newFile)) {
        return false;
    }

    // console.log('create file', newFile.mediaType)
    newFile.id = Math.random().toString(36).substring(2, 12);
    newFile.createAt = Date.now();

    // icon
    newFile.icon = "default.png";
    for (const key in iconType) {
        if (newFile.mediaType.indexOf(iconType[key]) != -1) {
            // console.log('find', key, iconType[key]);
            newFile.icon = iconFile[key];
            break;
        }
    }

    const files = await getAllFiles();
    // files.unshift(newFile);
    files.push(newFile);
    await setFiles(files);

    return newFile;
}

export async function removeFileStore(fileInfo: IFileOnStore) {
    const files = await getAllFiles();

    for (let i = 0; i < files.length; i++) {
        if (files[i].id === fileInfo.id ) {
            files.splice(i, 1);
            break;
        }
    }
    await setFiles(files);

    return files
}

export async function updateFileStore(fileInfo: IFileOnStore) {
    const files = await getAllFiles();

    for (let i = 0; i < files.length; i++) {
        if (files[i].id === fileInfo.id ) {
            // files.splice(i, 1);
            files[i] = fileInfo
            break;
        }
    }
    await setFiles(files);

    return files
}

function setFiles(items) {
    return localforage.setItem(KEY_FILE, items);
}
