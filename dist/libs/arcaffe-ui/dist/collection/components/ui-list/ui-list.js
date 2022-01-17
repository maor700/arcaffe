import { bigmaManagerDb } from '@arcaffe/store';
import { Component, Element, Event, h, Prop, State, Watch, } from '@stencil/core';
import { liveQuery } from 'dexie';
import { render } from 'mustache';
const DEFAULT_ITEM_TEMPLATE = '{{id}}';
const DB = bigmaManagerDb;
console.log('UiList file Loaded');
export class UiList {
  constructor() {
    this.materials = [];
    this.subscribers = [];
    this.itemTemplate = DEFAULT_ITEM_TEMPLATE;
    this.selectHandler = (material) => {
      DB.selectMaterialToggle(material.id);
    };
    this.onDelete = (id) => {
      bigmaManagerDb.materials.delete(id);
    };
    this.showDetailsHandler = (material) => {
      this.showDetails.emit(material);
    };
    console.log('UiList component Loaded');
    if (!this.sourceName)
      return;
    const templateElement = this.elm.querySelector('[slot="item-template"]');
    if (templateElement) {
      this.itemTemplate = this._getTemplateHtmlAsString(templateElement);
    }
    this.subscribers.push(liveQuery(() => bigmaManagerDb.materials
      .where('sourceName')
      .equals(this.sourceName)
      .toArray()).subscribe((materials) => {
      this.materials = materials;
    }));
    this.subscribers.push(liveQuery(async () => {
      var _a;
      return (_a = (await bigmaManagerDb.materials
        .where('[sourceName+isSelected]')
        .equals([this.sourceName, 1])
        .first())) === null || _a === void 0 ? void 0 : _a.id;
    }).subscribe((selectedId) => {
      this.selected = selectedId;
    }));
  }
  scrollToSelected(newVal) {
    var _a;
    if (!newVal)
      return;
    const el = this.elm.querySelector('#' + this._buildId(newVal));
    console.log(el, '**el**');
    (_a = el === null || el === void 0 ? void 0 : el.scrollIntoView) === null || _a === void 0 ? void 0 : _a.call(el, {
      behavior: 'smooth',
      block: 'center',
    });
  }
  disconnectedCallback() {
    var _a;
    (_a = this.subscribers) === null || _a === void 0 ? void 0 : _a.forEach((_) => { var _a; return (_a = _ === null || _ === void 0 ? void 0 : _.unsubscribe) === null || _a === void 0 ? void 0 : _a.call(_); });
  }
  _getTemplateHtmlAsString(templateElm) {
    const templateConHtml = Array.from(templateElm.children)
      .map((_) => _.outerHTML)
      .join('');
    return templateConHtml;
  }
  _buildId(id) {
    return `item-${id}`;
  }
  render() {
    var _a;
    const items = (_a = this.materials) === null || _a === void 0 ? void 0 : _a.map((material) => {
      const itemCustomContent = render(this.itemTemplate, material);
      return (h("div", { id: this._buildId(material.id), onClick: () => this.selectHandler(material), class: `item-child material-item ${material.isSelected ? 'selected' : ''}` },
        h("div", { class: "custom-content", innerHTML: itemCustomContent }),
        h("div", { class: "actions" },
          h("div", { class: "btns" },
            h("button", { onClick: () => this.showDetailsHandler(material), class: "details" }, "Details"),
            h("button", { onClick: () => {
                this.onDelete(material.id);
              }, class: "delete" }, "Delete")))));
    });
    return h("div", { class: "list-con" }, items);
  }
  static get is() { return "ui-list"; }
  static get originalStyleUrls() { return {
    "$": ["ui-list.scss"]
  }; }
  static get styleUrls() { return {
    "$": ["ui-list.css"]
  }; }
  static get properties() { return {
    "sourceName": {
      "type": "string",
      "mutable": false,
      "complexType": {
        "original": "string",
        "resolved": "string",
        "references": {}
      },
      "required": false,
      "optional": false,
      "docs": {
        "tags": [],
        "text": "Array of items"
      },
      "attribute": "source-name",
      "reflect": false
    }
  }; }
  static get states() { return {
    "materials": {},
    "selected": {}
  }; }
  static get events() { return [{
      "method": "showDetails",
      "name": "showDetails",
      "bubbles": true,
      "cancelable": true,
      "composed": true,
      "docs": {
        "tags": [],
        "text": ""
      },
      "complexType": {
        "original": "any",
        "resolved": "any",
        "references": {}
      }
    }]; }
  static get elementRef() { return "elm"; }
  static get watchers() { return [{
      "propName": "selected",
      "methodName": "scrollToSelected"
    }]; }
}
