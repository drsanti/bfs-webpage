
// https://github.com/luixaviles/event-bus-typescript/tree/master


export interface Registry {
    unregister: () => void;
}

export interface Callable {
    [key: string]: (...args: any[]) => any;
}

export interface Subscriber {
    [key: string]: Callable;
}

export interface IBfsEventBus {
    dispatch<T>(event: string, arg?: T): void;
    register(event: string, callback: (...args: any[]) => any): Registry;
}


export class BfsEventBus implements IBfsEventBus {
    private subscribers: Subscriber;
    private static nextId = 0;
    private static instance?: BfsEventBus = undefined;



    private constructor() {
        this.subscribers = {};
    }

    public static getInstance(): BfsEventBus {
        if (this.instance === undefined) {
            this.instance = new BfsEventBus();
        }

        return this.instance;
    }


    public dispatch<T>(event: string, arg?: T): void {
        const subscriber = this.subscribers[event];

        if (subscriber === undefined) {
            return;
        }

        Object.keys(subscriber).forEach((key) => subscriber[key](arg));
    }

    public register(event: string, callback: (...args: any[]) => any): Registry {
        const id = this.getNextId();
        if (!this.subscribers[event]) this.subscribers[event] = {};

        this.subscribers[event][id] = callback;

        return {
            unregister: () => {
                delete this.subscribers[event][id];
                if (Object.keys(this.subscribers[event]).length === 0)
                    delete this.subscribers[event];
            },
        };
    }

    private getNextId(): number {
        return BfsEventBus.nextId++;
    }
}

/*

import { EventBus } from './event-bus/event-bus';

const registry = EventBus.getInstance().register('hello-world', (name: string) => {
    if(name)
        console.log('Hello ' + name);
    else 
        console.log('Hello world');
});


EventBus.getInstance().dispatch<string>('hello-world', 'Luis');
EventBus.getInstance().dispatch<string>('hello-world');

registry.unregister();
EventBus.getInstance().dispatch<string>('hello-world');

*/