import * as THREE from "three";
import { GLTFLoader, type GLTF } from "./GLTFLoader";


export interface ModelInfo {
    path: string;
    size: number;
    sceneNames: string[];
}

export interface ModelData {
    glTF: GLTF;
    info: ModelInfo;
}

export interface ModelDownloadInfo {
    path: string;
    percent: number;
    loaded: number;
    total: number
}

export type ModelLoadingCallback = (info: ModelDownloadInfo) => void;
export type ModelLoadedCallback = (data: ModelData) => void;
export type ModelErrorCallback = (error: string) => void;

export interface ModelLoaderCallbacks {
    onProgress?: ModelLoadingCallback
    onLoaded?: ModelLoadedCallback
    onError?: ModelErrorCallback
}




// export interface TextureInfo {
//     path: string;
//     size: number;
//     sceneNames: string[];
// }



// export interface TextureData {
//     texture: THREE.Texture;
//     info: TextureInfo;
// }

// export interface TextureDownloadInfo {
//     path: string;
//     percent: number;
//     loaded: number;
//     total: number
// }

export class BfsGLTFLoader {

    private static instance?: BfsGLTFLoader;

    private constructor() {
        // 
    }

    public static getInstance = () => {
        if (this.instance === undefined) {
            this.instance = new BfsGLTFLoader();
        }
        return this.instance;
    }

    public loadGLTF = (gltfPath: string, callbackOptions?: ModelLoaderCallbacks): Promise<ModelData> => {

        return new Promise((resolve, reject) => {

            // const clog = (s1: string, s2: string) => console.log(`process %c${s1} %c${s2}`, `color: yellow`, `color: lime`)
            let bytes = 0;

            new GLTFLoader().load(gltfPath, (glTF: GLTF) => {

                glTF.scene.traverse((c: THREE.Object3D) => {
                    if (c instanceof THREE.Mesh) {
                        c.castShadow = true;
                        c.receiveShadow = true;
                    }
                });

                const names: string[] = [];
                glTF.scenes.forEach(s => {
                    names.push(s.name);
                });

                const info = { path: gltfPath, size: bytes, sceneNames: names }
                const modelData: ModelData = { glTF, info }
                callbackOptions?.onLoaded?.(modelData);
                resolve(modelData);

            }, (xhr: any) => {
                bytes = xhr.total;
                const info: ModelDownloadInfo = {
                    path: gltfPath, percent: (xhr.loaded / xhr.total) * 100,
                    loaded: xhr.loaded, total: xhr.total
                };
                callbackOptions?.onProgress?.(info);
            }, (error: any) => {
                const msg = `Error loading GLTF model - ${error}`;
                callbackOptions?.onError?.(msg);
                reject(msg);
                console.error();
            }
            );
        });
    }
}

