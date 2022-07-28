import styles from './list.module.less';
import '@ui5/webcomponents-icons/dist/employee.js';
import '@ui5/webcomponents-icons/dist/database';
import {
  Button,
  List,
  Icon,
  StandardListItem,
  CustomListItem,
  MultiComboBox,
  MultiComboBoxItem,
  FlexBox,
  FlexBoxJustifyContent,
  FlexBoxAlignItems,
} from '@ui5/webcomponents-react';
import { useState } from 'react';

/* eslint-disable-next-line */
export interface ListProps {}

export function UsersList(props: ListProps) {
  const [showMulti, setShowMulti] = useState(false);
  return (
    <div className={styles['container']}>
      <h1>Welcome to List!</h1>
      <Button
        onClick={() => {
          setShowMulti(!showMulti);
        }}
      >
        Test
      </Button>
      <List
        footerText="dfzsd arg sfrgsfgsfg sg shg safg tg jhmk fjm asdf"
        mode={showMulti ? 'MultiSelect' : 'SingleSelect'}
      >
        <CustomListItem selected>
          <FlexBox
            justifyContent={FlexBoxJustifyContent.Start}
            alignItems={FlexBoxAlignItems.Baseline}
            style={{
              gap: '0.5em',
              width: '100%',
            }}
          >
            <Icon name="employee" />
            <span slot="title">Maor Elimelech</span>
            <span>
              <MultiComboBox>
                <Icon slot="icon" name="employee"/>
                <MultiComboBoxItem text="Item 1" additionalText="More text"/>
                <MultiComboBoxItem text="Item 2" />
                <MultiComboBoxItem text="Item 3" />
                <MultiComboBoxItem text="Item 4" />
                <MultiComboBoxItem text="Item 5" />
              </MultiComboBox>
              ;
            </span>
          </FlexBox>
        </CustomListItem>
        <StandardListItem icon="database">
          <div className={styles['item-content']}>
            <span>Maor Elimelech</span>
          </div>
        </StandardListItem>
      </List>
    </div>
  );
}
