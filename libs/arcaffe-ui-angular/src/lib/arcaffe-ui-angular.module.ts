import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MyComponent, UiList } from '../generated/directives/proxies';
import { defineCustomElements } from '@arcaffe/arcaffe-ui/loader';
export * from '../generated/directives/proxies';
defineCustomElements();

@NgModule({
  declarations: [MyComponent, UiList],
  imports: [CommonModule],
  exports: [MyComponent, UiList],
})
export class ArcaffeUiAngularModule {}
