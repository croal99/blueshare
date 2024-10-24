export interface IStoreOnChain {
    file_counter: number;
    files: {
        handle: string;
    };
    owner: string;
}

export interface IFileInfoOnChain {
    filename: string;
    media: string;
    blobId: string;
    hash: string;
    salt: string;
    share: number;      // 1 - free; 2 - code; 3 - pay
    fee: number;
    code: string;
    owner: string;
}
