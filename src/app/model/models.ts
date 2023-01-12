export interface TransFile {
    path: string,
    charset: string,
    content: string,
    defaultLocalePath: string,
    enLocalePath: string,
    replaceTargets: ReplaceTarget[]
}

export interface ReplaceTarget {
    targetStr: string,
    key: string,
}

export interface TransResult {
    filePath: string,
    fileContent: string,
    defaultLocalePath: string,
    defaultLocalePathContent: string,
    enLocalePath: string,
    enLocalePathContent: string,
}