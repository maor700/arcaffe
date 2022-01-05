import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { NxWelcomeComponent } from './nx-welcome.component';
import { MaterialsListComponent } from './materials-list/materials-list.component';
import { MaterialsListItemComponent } from './materials-list-item/materials-list-item.component';

@NgModule({
  declarations: [AppComponent, NxWelcomeComponent, MaterialsListComponent, MaterialsListItemComponent],
  imports: [BrowserModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
