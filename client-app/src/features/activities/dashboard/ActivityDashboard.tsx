import React, { FC, useContext } from 'react'
import { Grid } from 'semantic-ui-react'
import ActivityForm from '../form/ActivityForm'
import { observer } from 'mobx-react-lite'
import ActivityList from './ActivityList'
import ActivityDetails from '../details/ActivityDetails'
import ActivityStore from '../../../app/stores/activityStore';

const ActivityDashboard: FC = () => {
  const activityStore = useContext(ActivityStore);
  const { selectedActivity, editMode } = activityStore

  return (
    <Grid>
      <Grid.Column width='10'>
        <ActivityList />
      </Grid.Column>
      <Grid.Column width='6'>
        {selectedActivity && !editMode &&
          <ActivityDetails />
        }
        {editMode &&
          <ActivityForm
            key={selectedActivity?.id || 0}
            activity={selectedActivity!}
          />}
      </Grid.Column>
    </Grid>
  )
}

export default observer(ActivityDashboard);