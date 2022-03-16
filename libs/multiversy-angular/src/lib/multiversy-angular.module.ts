import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { defineCustomElements } from '@multiversy/ui/loader';
defineCustomElements();

@NgModule({
  declarations:[],
  imports: [CommonModule],
})
export class MultiversyAngularModule {}
