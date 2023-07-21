import { BfsLooper, type LooperCallback } from "./BfsLooper";


type CanvasLayer = "front" | "middle" | "back";

export class BfsCanvas {

    private canvas: HTMLCanvasElement;
    private context: CanvasRenderingContext2D;

    private container: HTMLElement | null;


    private scale = 1.0;


    private canvases: HTMLCanvasElement[] = [];
    private contexts: CanvasRenderingContext2D[] = [];

    private createCanvas = (idPrefix: string, zIndex: number) => {
        const canvas = document.createElement("canvas");
        const uid = (Math.random() * 100000).toFixed(0);
        canvas.id = `${idPrefix}-${uid}`;
        canvas.style.position = "absolute";
        canvas.style.zIndex = `${zIndex}`;
        return canvas;
    }




    constructor(container: HTMLElement | null) {

        if (!container) {
            throw new Error("No container is founded!");
        }
        this.container = container;
        this.container.style.position = "relative";

        //
        this.canvases.push(this.createCanvas("bfs-canvas-front", 3));
        this.canvases.push(this.createCanvas("bfs-canvas-middle", 2));
        this.canvases.push(this.createCanvas("bfs-canvas-back", 1));

        const rect = this.container.getBoundingClientRect();
        for (let i = 0; i < this.canvases.length; i++) {
            this.contexts[i] = this.canvases[i].getContext("2d") as CanvasRenderingContext2D;
            this.canvases[i].width = rect.width;
            this.canvases[i].height = rect.height;
            this.container.appendChild(this.canvases[i]);
        }

        //
        const selected = this.selectLayer("back")
        this.canvas = selected.canvas;
        this.context = selected.context;

        //
        window.addEventListener("resize", () => this.onResize());


        this.fillBackground();

    }

    public selectLayer = (layer: CanvasLayer) => {
        if (layer === "front") {
            this.canvas = this.canvases[0];
            this.context = this.contexts[0];
        }
        if (layer === "middle") {
            this.canvas = this.canvases[1];
            this.context = this.contexts[1];
        }
        if (layer === "back") {
            this.canvas = this.canvases[2];
            this.context = this.contexts[2];
        }

        return this;
    }

    public addUpdateCallback = (callback: LooperCallback) => {
        BfsLooper.getInstance().addUpdateCallback(callback);
    }

    private onResize = () => {
        if (this.container) {
            const rect = this.container.getBoundingClientRect();
            this.resize(rect?.width, rect?.height);
            this.fillBackground();
        }
    }

    public dispose = () => {
        window.removeEventListener("resize", this.onResize);
    }

    public getWidth = () => this.canvas.width;
    public getHeight = () => this.canvas.height;




    public getCanvas = () => this.canvas;


    public getContext = () => this.context;


    public cX = () => this.canvas.width / 2;
    public cY = () => this.canvas.height / 2;

    private nGx = 8;
    private nGy = 8;
    public gX = () => this.canvas.width / this.nGx;
    public gY = () => this.canvas.height / this.nGy;

    public setGridCount = (nGx: number, nGy: number) => {
        this.nGx = nGx;
        this.nGy = nGy;
    }

    private gridColor = "#333";
    public setGridColor = (color: string) => {
        this.gridColor = color;
    }


    private isShowGrids = false;

    public showGrids = (enabled: boolean) => {
        this.isShowGrids = enabled;
        return this;
    }

    private drawGrids = (nGx?: number, nGy?: number) => {
        this.nGx = nGx || this.nGx;
        this.nGy = nGy || this.nGy;
        //
        this.selectLayer("back");
        const ctx = this.getContext();
        ctx.save();

        //
        const sx = this.gX();
        const sy = this.gY();
        const w = this.getWidth();
        const h = this.getHeight();

        //
        ctx.strokeStyle = this.gridColor;
        ctx.setLineDash([5, 7]);
        ctx.lineWidth = 1.1;


        // Vertical grid lines
        for (let i = 1; i < this.nGx; i++) {
            ctx.beginPath();
            const x = sx * i;
            ctx.moveTo(x, 0);
            ctx.lineTo(x, h);
            ctx.stroke();
        }
        // Horizontal grid lines
        for (let i = 1; i < this.nGy; i++) {
            ctx.beginPath();
            const y = sy * i;
            ctx.moveTo(0, y);
            ctx.lineTo(w, y);
            ctx.stroke();
        }

        //
        ctx.restore();
    }


    public clear = () => {
        this.canvas.width = this.canvas.width + 0;
    }

    public fillBackground = (color?: string) => {
        const ctx = this.selectLayer("back").context;
        ctx.fillStyle = color || "rgba(0,0,0,0)";
        ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        if (this.isShowGrids === true) {
            this.drawGrids();
        }
        return this;
    }


    public fill = (color: string) => {
        const ctx = this.context;
        ctx.fillStyle = color || "rgba(0,0,0,0)";
        ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        return this;
    }


    public resize = (width: number, height: number) => {
        for (let i = 0; i < this.canvases.length; i++) {
            this.canvases[i].width = width;
            this.canvases[i].height = height;
        }
        return this;
    }
}


