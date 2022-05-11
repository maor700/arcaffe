import { bigmaManagerDb, IFilteredMaterial, IMaterial } from '@arcaffe/store';
import {
  Component,
  Element,
  Event,
  EventEmitter,
  h,
  Prop,
  State,
  Watch,
} from '@stencil/core';
import { liveQuery, Subscription } from 'dexie';
import { render } from 'mustache';

const DEFAULT_ITEM_TEMPLATE = '{{id}}';
const DB = bigmaManagerDb;

console.log('UiList file Loaded');

@Component({
  tag: 'ui-list',
  styleUrl: 'ui-list.scss',
  shadow: false,
})
export class UiList {
  /**
   * Array of items
   */
  @Prop() sourceName: string;

  @State() filteredMaterials: IFilteredMaterial[] = [];

  @State() selected: string;

  @Element() elm: HTMLElement;

  @Event() showDetails: EventEmitter;

  @Watch('selected')
  scrollToSelected(newVal: string) {
    if (!newVal) return;
    const el = this.elm.querySelector('#' + this._buildId(newVal));
    console.log(el, '**el**');

    el?.scrollIntoView?.({
      behavior: 'smooth',
      block: 'center',
    });
  }

  private subscribers: Subscription[] = [];

  itemTemplate: string = DEFAULT_ITEM_TEMPLATE;

  constructor() {
    console.log('UiList component Loaded');
    if (!this.sourceName) return;
    const templateElement: HTMLTemplateElement = this.elm.querySelector(
      '[slot="item-template"]'
    );

    if (templateElement) {
      this.itemTemplate = this._getTemplateHtmlAsString(templateElement);
    }

    this.subscribers.push(
      liveQuery(() =>
        bigmaManagerDb.filteredMaterials
          .where('sourceName')
          .equals(this.sourceName)
          .toArray()
      ).subscribe((materials) => {
        this.filteredMaterials = materials;
      })
    );

    this.subscribers.push(
      liveQuery<string>(
        async () =>
          (
            await bigmaManagerDb.filteredMaterials
              .where('[sourceName+isSelected]')
              .equals([this.sourceName, 1])
              .first()
          )?.id
      ).subscribe((selectedId) => {
        this.selected = selectedId;
      })
    );
  }

  disconnectedCallback() {
    this.subscribers?.forEach((_) => _?.unsubscribe?.());
  }

  private _getTemplateHtmlAsString(templateElm: HTMLTemplateElement): string {
    const templateConHtml = Array.from(templateElm.children)
      .map((_) => _.outerHTML)
      .join('');
    return templateConHtml;
  }

  private _buildId(id) {
    return `item-${id}`;
  }

  selectHandler = (material: IFilteredMaterial) => {
    DB.selectMaterialToggle(material.id);
  };

  onDelete = (id: string) => {
    bigmaManagerDb.materials.delete(id);
  };

  showDetailsHandler = (material: IMaterial | null) => {
    this.showDetails.emit(material);
  };

  render() {
    const items = this.filteredMaterials?.map((material) => {
      const itemCustomContent = render(this.itemTemplate, material);
      return (
        <div
          id={this._buildId(material.id)}
          onClick={() => this.selectHandler(material)}
          class={`item-child material-item ${
            material.isSelected ? 'selected' : ''
          }`}
        >
          <div class="custom-content" innerHTML={itemCustomContent}></div>
          <div class="actions">
            <div class="btns">
              <button
                onClick={() => this.showDetailsHandler(material)}
                class="details"
              >
                Details
              </button>
              <button
                onClick={() => {
                  this.onDelete(material.id);
                }}
                class="delete"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      );
    });

    return <div class="list-con">{items}</div>;
  }
}
