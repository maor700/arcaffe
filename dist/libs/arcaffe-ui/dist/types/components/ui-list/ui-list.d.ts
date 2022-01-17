import { IMaterial } from '@arcaffe/store';
import { EventEmitter } from '../../stencil-public-runtime';
export declare class UiList {
  /**
   * Array of items
   */
  sourceName: string;
  materials: IMaterial[];
  selected: string;
  elm: HTMLElement;
  showDetails: EventEmitter;
  scrollToSelected(newVal: string): void;
  private subscribers;
  itemTemplate: string;
  constructor();
  disconnectedCallback(): void;
  private _getTemplateHtmlAsString;
  private _buildId;
  selectHandler: (material: IMaterial) => void;
  onDelete: (id: string) => void;
  showDetailsHandler: (material: IMaterial | null) => void;
  render(): any;
}
