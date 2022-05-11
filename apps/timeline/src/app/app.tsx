/* eslint-disable no-console */
import React, { Component, createRef } from 'react';
import moment from 'moment';
import './app.module.less';

import Timeline, {
  TimelineMarkers,
  TimelineHeaders,
  TodayMarker,
  CustomMarker,
  CursorMarker,
  CustomHeader,
  SidebarHeader,
  DateHeader,
} from 'react-calendar-timeline';
import 'react-calendar-timeline/lib/Timeline.css';

import { Group, Item, groupsAndItems$ } from './generate-fake-data';
import { from, Subscription } from 'rxjs';
import { bigmaManagerDb } from '@arcaffe/store';
import { liveQuery } from 'dexie';

const minTime = moment().add(-6, 'months').valueOf();
const maxTime = moment().add(6, 'months').valueOf();

const keys = {
  groupIdKey: 'id',
  groupTitleKey: 'title',
  groupRightTitleKey: 'rightTitle',
  itemIdKey: 'id',
  itemTitleKey: 'title',
  itemDivTitleKey: 'title',
  itemGroupKey: 'group',
  itemTimeStartKey: 'start',
  itemTimeEndKey: 'end',
};

type State = {
  groups: Group[];
  items: Item[];
  defaultTimeStart: Date;
  defaultTimeEnd: Date;
};

export class App extends Component<any, State> {
  uidSubscription!: Subscription;
  selectedSubscription!: Subscription;
  elm = createRef<any>();

  constructor(props) {
    super(props);

    const defaultTimeStart = moment().startOf('day').toDate();
    const defaultTimeEnd = moment().startOf('day').add(1, 'day').toDate();

    this.uidSubscription = groupsAndItems$.subscribe(({ groups, items }) => {
      this.setState({ groups, items });
    });

    this.state = {
      groups: [],
      items: [],
      defaultTimeStart,
      defaultTimeEnd,
    };
  }

  componentDidMount() {
    this.selectedSubscription = from(
      liveQuery(() => {
        return bigmaManagerDb.filteredMaterials.where('isSelected').equals(1).first();
      })
    ).subscribe((material) => {
      if (!material || !this.elm.current) return;
      const timelineElm = this.elm.current;
      console.log(timelineElm.container);
      const { id } = material;
      const selected = this.state.items.find((item) => item.id === id);
      if (!selected) return;
      const selectedElement = timelineElm.container?.querySelector?.('.item-' + id);
      console.log(selectedElement);
      selectedElement?.scrollIntoViewIfNeeded?.({
        behavior: 'auto',
        block: 'center',
        inline: 'center',
      });
    });
  }

  componentWillUnmount() {
    this.uidSubscription?.unsubscribe();
    this.selectedSubscription?.unsubscribe();
  }

  handleCanvasClick = (groupId, time) => {
    console.log('Canvas clicked', groupId, moment(time).format());
  };

  handleCanvasDoubleClick = (groupId, time) => {
    console.log('Canvas double clicked', groupId, moment(time).format());
  };

  handleCanvasContextMenu = (group, time) => {
    console.log('Canvas context menu', group, moment(time).format());
  };

  handleItemClick = (itemId, _, time) => {
    console.log('Clicked: ' + itemId, moment(time).format());
  };

  handleItemSelect = async (itemId, ev?, time?) => {
    await bigmaManagerDb.selectMaterialToggle(itemId, true);
    console.log('Selected: ' + itemId, moment(time).format());
  };

  handleItemDoubleClick = (itemId, _, time) => {
    console.log('Double Click: ' + itemId, moment(time).format());
  };

  handleItemContextMenu = (itemId, _, time) => {
    console.log('Context Menu: ' + itemId, moment(time).format());
  };

  handleItemMove = (itemId, dragTime, newGroupOrder) => {
    const { items, groups } = this.state;

    const group = groups[newGroupOrder];

    this.setState({
      items: items.map((item) =>
        item.id === itemId
          ? Object.assign({}, item, {
              start: dragTime,
              end: dragTime + (item.end - item.start),
              group: group.id,
            })
          : item
      ),
    });

    console.log('Moved', itemId, dragTime, newGroupOrder);
  };

  handleItemResize = (itemId, time, edge) => {
    const { items } = this.state;

    this.setState({
      items: items.map((item) =>
        item.id === itemId
          ? Object.assign({}, item, {
              start: edge === 'left' ? time : item.start,
              end: edge === 'left' ? item.end : time,
            })
          : item
      ),
    });

    console.log('Resized', itemId, time, edge);
  };

  // this limits the timeline to -6 months ... +6 months
  handleTimeChange = (visibleTimeStart, visibleTimeEnd, updateScrollCanvas) => {
    bigmaManagerDb.filters.where("name").equals("timeRange").modify({value:{start:new Date(visibleTimeStart), end:new Date(visibleTimeEnd)}})
    if (visibleTimeStart < minTime && visibleTimeEnd > maxTime) {
      updateScrollCanvas(minTime, maxTime);
    } else if (visibleTimeStart < minTime) {
      updateScrollCanvas(
        minTime,
        minTime + (visibleTimeEnd - visibleTimeStart)
      );
    } else if (visibleTimeEnd > maxTime) {
      updateScrollCanvas(
        maxTime - (visibleTimeEnd - visibleTimeStart),
        maxTime
      );
    } else {
      updateScrollCanvas(visibleTimeStart, visibleTimeEnd);
    }
  };

  handleZoom = (timelineContext, unit) => {
    console.log('Zoomed', timelineContext, unit);
  };

  moveResizeValidator = (action, item, time) => {
    if (time < new Date().getTime()) {
      const newTime =
        Math.ceil(new Date().getTime() / (15 * 60 * 1000)) * (15 * 60 * 1000);
      return newTime;
    }

    return time;
  };

  render() {
    const { groups, items, defaultTimeStart, defaultTimeEnd } = this.state;

    return (
      <Timeline
        ref={this.elm}
        groups={groups}
        items={items}
        keys={keys}
        sidebarWidth={200}
        canMove
        canResize="right"
        canSelect
        itemsSorted
        itemTouchSendsClick={false}
        stackItems
        itemHeightRatio={0.75}
        defaultTimeStart={defaultTimeStart}
        defaultTimeEnd={defaultTimeEnd}
        onCanvasClick={this.handleCanvasClick}
        onCanvasDoubleClick={this.handleCanvasDoubleClick}
        onCanvasContextMenu={this.handleCanvasContextMenu}
        onItemClick={this.handleItemClick}
        onItemSelect={this.handleItemSelect}
        onItemContextMenu={this.handleItemContextMenu}
        onItemMove={this.handleItemMove}
        onItemResize={this.handleItemResize}
        onItemDoubleClick={this.handleItemDoubleClick}
        onTimeChange={this.handleTimeChange}
        onZoom={this.handleZoom}
        moveResizeValidator={this.moveResizeValidator}
      >
        <TimelineMarkers>
          <TodayMarker />
        </TimelineMarkers>
      </Timeline>
    );
  }
}
