import { Component, h } from '@stencil/core';

@Component({
  tag: 'one-header',
  styleUrl: 'one-header.css',
  // shadow: true
})
export class OneHeader {
  render() {
    const commonClasses = "flex font-medium gap-5";
    return (
      <header class="app-header flex justify-between text-on-primary opacity-95 leading-[2] border-b-2 border-primary">
        <div class={`start-group ${commonClasses}`}>
          <div class="logo bg-primary text-background p-2 leading-[1.1]">ONE KAMAN</div>
          <div class="select-mission">משימה ראשית פצ"ן</div>
          <div class="teshen">תש"ן</div>
        </div>
        <div class={`center-group ${commonClasses}`}>
          <stencil-route-link url="/work-surface" class="tab hover:text-primary cursor-pointer">משטח עבודה</stencil-route-link>
          <stencil-route-link url="/display-surface" class="tab hover:text-primary cursor-pointer">משטח הצגה</stencil-route-link>
          <stencil-route-link url="/files" class="tab hover:text-primary cursor-pointer">קבצים</stencil-route-link>
          <stencil-route-link url="/mission-activity" class="tab hover:text-primary cursor-pointer">פעילות במשימה</stencil-route-link>
        </div>
        <div class={`end-group ${commonClasses} font-normal`}>
          <div class="btn squar">S</div>
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
