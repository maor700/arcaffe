import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { MaterialsListComponent } from './materials-list/materials-list.component';
import { MaterialsListItemComponent } from './materials-list-item/materials-list-item.component';
import {ArcaffeUiAngularModule} from '@common-ui/angular';

console.log(ArcaffeUiAngularModule);


@NgModule({
  declarations: [AppComponent, MaterialsListComponent, MaterialsListItemComponent ],
  imports: [BrowserModule, ArcaffeUiAngularModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
