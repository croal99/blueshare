export interface INewBlobOnWalrus {
    blobObject: {
        id: string,
        storedEpoch: number,
        blobId: string,
        size: number,
        erasureCodeType: string,
        certifiedEpoch: number,
        storage: {
            id: string,
            startEpoch: number,
            endEpoch: number,
            storageSize: number,
        }
    }
}

export interface IBlobOnWalrus {
    blobId: string,
    event: {
        txDigest: string,
        eventSeq: string,
    }
    endEpoch: number,
}
