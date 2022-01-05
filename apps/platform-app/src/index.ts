import Dexie from 'dexie';
import { BigmaManagerDB } from '@arcaffe/store';

export { Components, JSX } from './components';
declare global {
    interface Window { parentApp: ParentApp; }
    interface ParentApp {
        services: AppServices
    }
}

export type AppServices = {
    model: BigmaManagerDB,
    dexie: Dexie,
    UiLauncher?: any,
    toaster?: any,
}
import '@stencil/router';

