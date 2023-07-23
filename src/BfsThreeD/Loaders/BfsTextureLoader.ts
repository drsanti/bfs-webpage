import * as THREE from "three";

export interface TextureInfo {
    path: string;
    size: number;
    sceneNames: string[];
}

export interface TextureData {
    texture: THREE.Texture;
    info: TextureInfo;
}

export interface TextureDownloadInfo {
    path: string;
    percent: number;
    loaded: number;
    total: number
}



export interface CubeTextureDownloadInfo {
    url: string, loaded: number, total: number, tag: string
}


export interface CubeTextureDownloaderCallbacks {
    onStart?: (info?: string) => void;
    onProgress?: (info: CubeTextureDownloadInfo) => void;
    onDownloaded?: (cubeText: THREE.CubeTexture) => void;
    onError?: (error: string, url?: string) => void;
}

export class BfsTextureLoader {

    private static instance?: BfsTextureLoader;

    private constructor() {
        //
    }


    public static getInstance = () => {
        if (this.instance === undefined) {
            this.instance = new BfsTextureLoader();
        }
        return this.instance;
    }

    async loadCubeEnvTexture(path: string, names: string[], callbackOptions?: CubeTextureDownloaderCallbacks): Promise<THREE.CubeTexture> {

        //>> Helper function
        const getTag = (url: string) => {
            return url.includes('park') ? 'park' : url.includes('bridge') ? 'bridge' : url.includes('snow') ? 'snow' : 'unknown';
        }

        return new Promise((resolve, reject) => {

            new THREE.CubeTextureLoader(new THREE.LoadingManager(

                () => {
                    callbackOptions?.onStart?.(`start downloading ${names.length} files from "${path}"`);
                },

                (url: string, loaded: number, total: number) => {
                    /**
                     * loaded: number of files loaded
                     * total: number of files to be downloaded
                     */
                    //console.log(`%c${loaded}/${total} - ${url}`, `color: ${url.includes('park') ? '#8f8' : url.includes('bridge') ? '#88f': '#ff8'}`)
                    const tag = getTag(url);
                    const info: CubeTextureDownloadInfo = { url, loaded, total, tag }
                    callbackOptions?.onProgress?.(info);
                },

                (url: string) => {
                    const errMsg = `Error loading ${url}`
                    console.error(errMsg);
                    reject(errMsg);
                    callbackOptions?.onError?.(errMsg, url);
                })

            ).setPath(path).load(names, (cubeText: THREE.CubeTexture) => {
                cubeText.name = getTag(path);
                resolve(cubeText);
                callbackOptions?.onDownloaded?.(cubeText);
                cubeText.dispose();
            }, (xhr: any) => {
                xhr
                console.log(xhr.loaded)
            })
        })
    }

    async loadDefaultCubeEnvTexture(dir: "bridge" | "park" | "snow", callbackOptions?: CubeTextureDownloaderCallbacks): Promise<THREE.CubeTexture> {
        // dir: "show", "bridge", "park", etc.
        const names = ["posx.jpg", "negx.jpg", "posy.jpg", "negy.jpg", "posz.jpg", "negz.jpg"]
        return this.loadCubeEnvTexture(`textures/cube/${dir}/`, names, callbackOptions);
    }
}