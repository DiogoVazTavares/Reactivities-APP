import React, { FC, useContext, Fragment } from 'react';
import { observer } from 'mobx-react-lite';
import ActivityItem from './ActivityItem';
import { Item, Label } from 'semantic-ui-react';
import ActivityStore from '../../../app/stores/activityStore';

const ActivityList: FC = () => {
  const activityStore = useContext(ActivityStore);
  const { activitiesByDate } = activityStore;

  return (
    <>
      {activitiesByDate.map(([group, activities]) =>
        <Fragment key={group}>
          <Label size="large" color="blue" content={group} />
          <Item.Group divided>
            {activities.map(activity =>
              <ActivityItem key={activity.id} activity={activity} />
            )}
          </Item.Group>
        </Fragment>
      )}
    </>
  )
}

export default observer(ActivityList);