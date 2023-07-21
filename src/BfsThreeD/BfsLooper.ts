import { BfsEventBus, type Registry } from "./BfsEventBus";



export interface LooperParams {
    frameCount: number;
    deltaTime: number;
}

export type LooperCallback = (params: LooperParams) => void;


export class BfsLooper {

    private static instance?: BfsLooper;

    private isRunning = false;

    private animationId = 0;

    private frameCount = 0;

    private deltaTime = 0;

    private dts: number[] = [];

    private callbacks: LooperCallback[] = [];

    private eventBus = BfsEventBus.getInstance();


    private constructor() {/* */ }

    public static getInstance = () => {
        if (!this.instance) {
            this.instance = new BfsLooper();
        }
        return this.instance;
    }

    public addUpdateCallback = (listener: LooperCallback) => {
        if (this.callbacks.indexOf(listener) === -1) {
            this.callbacks.push(listener);
        }
        return this;
    }

    public removeUpdateCallback = (listener: LooperCallback) => {
        const index = this.callbacks.indexOf(listener);
        if (index !== -1) {
            this.callbacks.splice(index, 1);
        }
        return this;
    }


    private timeStart = 0;
    private loop = () => {
        if (this.isRunning === false) {
            return;
        }
        this.animationId = requestAnimationFrame(this.loop);
        this.frameCount += 1;

        const ms = performance.now();

        const dt = (ms - this.timeStart) / 1000;
        this.timeStart = ms;

        this.dts.push(dt);
        if (this.dts.length > 10) {
            this.dts.shift();
        }


        this.deltaTime = this.dts.reduce((a: number, b: number) => { return a + b; }, 0) / this.dts.length;

        const data = { frameCount: this.frameCount, deltaTime: this.deltaTime }
        this.callbacks.forEach(callback => {
            callback(data);
        });

        if (this.frameCount % 10 == 0) {
            this.eventBus.dispatch("frame-10", data);
        }
        if (this.frameCount % 20 == 0) {
            this.eventBus.dispatch("frame-20", data);
        }
        if (this.frameCount % 50 == 0) {
            this.eventBus.dispatch("frame-50", data);
        }
    }

    public start = () => {

        if (this.isRunning === false) {
            this.animationId = requestAnimationFrame(this.loop);
        }
        this.isRunning = true;
        this.timeStart = performance.now();
        this.frameCount = 0;
        this.deltaTime = 0;
        return this;
    }

    public stop = () => {
        this.isRunning = false;
        cancelAnimationFrame(this.animationId);
        this.callbacks = [];
        return this;
    }

    public pause = () => {
        this.isRunning = false;
        return this;
    }

    public resume = () => {
        this.isRunning = true;
        this.animationId = requestAnimationFrame(this.loop);
        return this;
    }

    public onFrame = (callback: LooperCallback) => {
        this.addUpdateCallback(callback);
        return this;
    }


    private unRegisters: Registry[] = [];


    public on = (event: "frame-10" | "frame-20" | "frame-50", callback: LooperCallback) => {
        this.unRegisters.push(this.eventBus.register(event, callback));
        return this;
    }

    public dispose = () => {
        this.stop();
        this.unRegisters.forEach((ur: Registry) => {
            ur.unregister();
        });
        return this;
    }
}

