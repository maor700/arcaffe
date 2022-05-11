import { bigmaManagerDb, ILayoutRecord } from '@arcaffe/store';
import { Component, h, State } from '@stencil/core';
import { liveQuery } from 'dexie';
import { LayoutConfig } from 'golden-layout';
import { LAYOUT_STATE_CHANGED } from '../../globals/channels';

const layoutStateChanged = new BroadcastChannel(LAYOUT_STATE_CHANGED);

@Component({
  tag: 'one-header',
  styleUrl: 'one-header.css',
  // shadow: true
})
export class OneHeader {
  @State() workspaces: ILayoutRecord[] = [];
  @State() dirt = false;
  @State() currentLayout: ILayoutRecord;
  public selectElm;

  componentWillLoad() {
    liveQuery(async () => {
      return await bigmaManagerDb.app.layout;
    }).subscribe((layoutRecord: ILayoutRecord) => {
      this.currentLayout = layoutRecord;
    });

    liveQuery(async () => {
      return bigmaManagerDb.layouts.toArray();
    }).subscribe((layouts) => {
      this.workspaces = layouts;
    });

    layoutStateChanged.addEventListener(
      'message',
      ({ data }: MessageEvent<LayoutConfig>) => {
        console.log('dirt');
        this.currentLayout = {...this.currentLayout, layout:data};
        this.dirt = true;
      }
    );
  }

  private changeWorkspacesHandler = () => {
    const layout = this.workspaces[this.selectElm.selectedIndex];
    bigmaManagerDb.app.layout = layout;
  };

  private save = async () => {
    const targetLayoutName = (await bigmaManagerDb.app.layout)?.name;
    if (!targetLayoutName) return;
    try {
      await bigmaManagerDb.layouts
        .where('name')
        .equals(targetLayoutName)
        .modify({ layout: this.currentLayout.layout });
      this.dirt = false;
    } catch (error) {
      console.error(error);
    }
  };

  render() {
    const commonClasses = 'flex font-medium gap-5';
    console.log(this.currentLayout?.name);

    return (
      <header class="app-header flex justify-between text-on-primary opacity-95 leading-[2] border-b-2 border-primary">
        <div class={`start-group ${commonClasses}`}>
          <div class="logo bg-primary text-background p-2 leading-[1.1]">
            ONE KAMAN
          </div>
          <div class="select-mission">משימה ראשית פצ"ן</div>
          <div class="teshen">תש"ן</div>
        </div>
        <div class={`center-group ${commonClasses}`}>
          <bma-filters-bar/>
          {/* <stencil-route-link
            url="/work-surface"
            class="tab hover:text-primary cursor-pointer"
          >
            משטח עבודה
          </stencil-route-link> */}
          {/* <stencil-route-link url="/display-surface" class="tab hover:text-primary cursor-pointer">משטח הצגה</stencil-route-link>
          <stencil-route-link url="/files" class="tab hover:text-primary cursor-pointer">קבצים</stencil-route-link>
          <stencil-route-link url="/mission-activity" class="tab hover:text-primary cursor-pointer">פעילות במשימה</stencil-route-link> */}
        </div>
        <div class={`end-group ${commonClasses} font-normal`}>
          <div class="btn squar">
            {this.dirt ? <button onClick={this.save}>save</button> : null}
            <select
              ref={(elm) => {
                this.selectElm = elm;
              }}
              onChange={this.changeWorkspacesHandler}
              name="workspaces"
              id="workspaces"
            >
              {this.workspaces.map(({ name }) => (
                <option
                  selected={this.currentLayout?.name == name}
                  value={name}
                >
                  {name}
                </option>
              ))}
            </select>
          </div>
          <div class="btn squar">S</div>
          <div class="vertical-divider">|</div>
          <div class="btn squar">תרגילי</div>
          <div class="btn squar">אוגדה 3654</div>
          <div class="btn squar">חשבון</div>
        </div>
      </header>
    );
  }
}
