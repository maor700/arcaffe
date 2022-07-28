/* eslint-disable react/jsx-no-bind */
import { bigmaManagerDb } from '@arcaffe/store';
import { Component, h, State } from '@stencil/core';
import { IFilter } from '@arcaffe/store';
import { liveQuery, Subscription } from 'dexie';
import dayjs from 'dayjs';

interface TimeRangeFilterValue {
  start: Date;
  end: Date;
}

@Component({
  tag: 'bma-filters-bar',
  styleUrl: 'bma-filters-bar.less',
  shadow: true,
})
export class BmaFiltersBar {
  @State() timeRangeFilter: IFilter<TimeRangeFilterValue> =
    DEFAULT_TIME_RANGE_FILTER;

  private suorcesSubscription: Subscription;

  componentWillLoad() {
    this.suorcesSubscription = liveQuery(() =>
      bigmaManagerDb.filters.get('timeRange')
    ).subscribe((timeRange) => {
      this.timeRangeFilter =
        timeRange ?? this.timeRangeFilter ?? DEFAULT_TIME_RANGE_FILTER;
    });
  }

  disconnectedCallback() {
    this.suorcesSubscription?.unsubscribe();
  }

  private dateFilterChangeHandler = (
    interval: Partial<TimeRangeFilterValue>
  ) => {
    bigmaManagerDb.filters
      .where('name')
      .equals('timeRange')
      .modify((filter: IFilter<TimeRangeFilterValue>) => {
        filter.value = { ...filter.value, ...interval };
      });
  };

  render() {
    return (
      <div class="filters">
        <span class="field">
          <label htmlFor="start">מתאריך:</label>
          <input
            name="start"
            type="datetime-local"
            value={formatDate(this.timeRangeFilter?.value?.start)}
            onChange={({ target }: any) => {
              this.dateFilterChangeHandler({ start: dayjs(target.value).toDate() });
            }}
            />
        </span>
        <span class="field">
          <label htmlFor="end">עד תאריך:</label>
          <input
            name="end"
            type="datetime-local"
            value={formatDate(this.timeRangeFilter?.value?.end)}
            onChange={({ target }: any) => {
              this.dateFilterChangeHandler({ end: dayjs(target.value).toDate() });
            }}
          />
        </span>
      </div>
    );
  }
}

const now = new Date();
const DEFAULT_TIME_RANGE_FILTER = {
  name: 'timeRange',
  ownerApp: 'app',
  isActive: 1,
  displayName: 'Time Filtering',
  value: { start: now, end: now },
  icon: 'watch',
};

bigmaManagerDb.on('populate', async () => {
  bigmaManagerDb.filters.bulkAdd([DEFAULT_TIME_RANGE_FILTER]);
});

// bigmaManagerDb.on('populate', async () => {
//   bigmaManagerDb.sources.bulkAdd([
//     { name: 'materials', color: 'green', ownerApp: 'materials' },
//     { name: 'users', color: 'blue', ownerApp: 'users' },
//   ]);
// });


function formatDate(date:Date){
  const dateStr = dayjs(date).format('YYYY-MM-DDThh:mm');
  return dateStr;
}