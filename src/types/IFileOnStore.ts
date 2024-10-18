export interface IFileOnStore {
    id: string;
    name: string;
    object_id: string;
    blob_id: string;
    media_type: string;
    icon: string;
    size: number;
    parent_id: string;
    password: string;
    salt: string;
    share: number;
    fee: number;
    code: string;
    create_at: number;
}

export interface IFolderOnStore {
    id: string;
    name: string;
    parentId: string;
    createAt: number;
}
