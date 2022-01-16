import { Component, Input } from '@angular/core';
import { IMaterial } from '@arcaffe/store';

@Component({
  selector: 'materials-list-item',
  templateUrl: './materials-list-item.component.html',
  styleUrls: ['./materials-list-item.component.less'],
})
export class MaterialsListItemComponent {
  @Input() data!:IMaterial;
   
}
