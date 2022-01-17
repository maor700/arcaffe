import { ChangeDetectorRef, ElementRef, EventEmitter, NgZone } from '@angular/core';
import { Components } from '@arcaffe/arcaffe-ui';
import * as i0 from "@angular/core";
export declare interface MyComponent extends Components.MyComponent {
}
export declare class MyComponent {
    protected z: NgZone;
    protected el: HTMLElement;
    constructor(c: ChangeDetectorRef, r: ElementRef, z: NgZone);
    static ɵfac: i0.ɵɵFactoryDeclaration<MyComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<MyComponent, "my-component", never, { "first": "first"; "last": "last"; "middle": "middle"; }, {}, never, ["*"]>;
}
export declare interface UiList extends Components.UiList {
    /**
     *
     */
    showDetails: EventEmitter<CustomEvent<any>>;
}
export declare class UiList {
    protected z: NgZone;
    protected el: HTMLElement;
    constructor(c: ChangeDetectorRef, r: ElementRef, z: NgZone);
    static ɵfac: i0.ɵɵFactoryDeclaration<UiList, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<UiList, "ui-list", never, { "sourceName": "sourceName"; }, {}, never, ["*"]>;
}
