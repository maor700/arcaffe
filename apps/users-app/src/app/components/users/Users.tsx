import { IUser } from '@arcaffe/common-types';
import { IMaterial, bigmaManagerDb, ISource } from '@arcaffe/store';
import { UiList, MyComponent } from '@common-ui/react';
import { useLiveQuery } from 'dexie-react-hooks';
import { useEffect, useCallback, useState } from 'react';
import { ModalPortal } from '../modalPortal/ModalPortal';
import { UserItem } from './userItem/UserItem';
import { MdClose } from 'react-icons/md';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
// eslint-disable-next-line import/no-webpack-loader-syntax
import usersCss from '!!url-loader!./Users.less';
import './Users.less';
import { useCssAsStringLoader } from '../modalPortal/useCssAsStringLoader';

const DEFAULT_USERS_SOURCE: ISource = {
  name: 'users',
  color: 'blue',
  ownerApp: 'users',
};

const DB = bigmaManagerDb;

export function Users() {
  const [showDetails, setShowDetails] = useState<IUser | null>(null);
  const modalCss = useCssAsStringLoader([usersCss]);
  const users = useLiveQuery(
    () => DB.materials.where('sourceName').equals('users').toArray(),
    [],
    []
  );

  useEffect(() => {
    fetch('http://localhost:8080/api/users')
      .then((res) => res.json())
      .then((users: IUser[]) => {
        const usersMaterials = users.map((user) => {
          const { id, address, email, name, startTime, endTime } = user;
          const { geo, city, street } = address;
          const geoj = {
            geometry: {
              type: 'Point',
              coordinates: [
                Number.parseFloat(geo.lng),
                Number.parseFloat(geo.lat),
              ],
            },
            type: 'Feature',
            properties: {
              name,
              content: `name:${name} email:${email} address:${street}, ${city}`,
            },
          } as GeoJSON.Feature;

          return {
            id,
            geo: geoj,
            sourceName: 'users',
            ownerApp: 'users-app',
            visibilityOnMap: 'on',
            type: 'user',
            additionalProps: user,
            startTime,
            endTime,
          } as IMaterial<IUser>;
        });

        DB.sources
          .get('users')
          .then((tree) =>
            !tree ? DB.sources.add(DEFAULT_USERS_SOURCE) : null
          );

        DB.materials.bulkPut(usersMaterials);
      });
  }, []);

  const userSelectHandler = useCallback((user: IUser) => {
    DB.selectMaterialToggle(user.id);
  }, []);

  const showDetailsHandler = useCallback((user: IUser | null) => {
    setShowDetails(user);
  }, []);

  const deleteHandler = useCallback((id: string) => {
    bigmaManagerDb.materials.delete(id);
  }, []);

  const itemRenderer = useCallback(
    function ({ isSelected, additionalProps: u }: IMaterial<IUser>) {
      return (
        <UserItem
          onShowDetails={showDetailsHandler}
          key={u?.id}
          {...u}
          isSelected={!!isSelected}
          onSelect={userSelectHandler}
          onDelete={deleteHandler}
        ></UserItem>
      );
    },
    [showDetailsHandler, userSelectHandler, deleteHandler]
  );

  return (
    <div className="users">
      <UiList
        onShowDetails={({ detail }) =>
          showDetailsHandler(detail?.additionalProps)
        }
        sourceName="users"
      >
        <template slot="item-template">
          <span>{`{{additionalProps.name}}`}</span>
          <span className="email">{`{{additionalProps.email}}`}</span>
        </template>
      </UiList>
      {/* {users && users?.map(itemRenderer)} */}
      {showDetails && (
        <ModalPortal name="user-details" css={modalCss}>
          <div className="modal-wrapper">
            <div className="details-content">
              <MdClose
                size="1.5em"
                onClick={() => setShowDetails(null)}
                className="close-btn"
              />
              <h3>User Details</h3>
              <div className="details-fields">
                <div className="row">
                  <div className="field-name">Name:</div>
                  <div className="field-value">{showDetails?.name}</div>
                </div>
                <div className="row">
                  <div className="field-name">Phone:</div>
                  <div className="field-value">{showDetails?.phone}</div>
                </div>
                <div className="row">
                  <div className="field-name">Email:</div>
                  <div className="field-value">{showDetails?.phone}</div>
                </div>
                <div className="row">
                  <div className="field-name">Address:</div>
                  <div className="field-value">
                    {showDetails?.address.suite}
                  </div>
                </div>
                <div className="row">
                  <div className="field-name">Company:</div>
                  <div className="field-value">{showDetails?.company.name}</div>
                </div>
                <div className="row">
                  <div className="field-name">Website:</div>
                  <div className="field-value">{showDetails?.website}</div>
                </div>
              </div>
            </div>
          </div>
        </ModalPortal>
      )}
    </div>
  );
}
