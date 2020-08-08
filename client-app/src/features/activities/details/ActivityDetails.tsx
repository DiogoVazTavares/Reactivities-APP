import React, { FC, useContext, useEffect } from 'react'
import { Grid } from 'semantic-ui-react';
import ActivityStore from '../../../app/stores/activityStore';
import { observer } from 'mobx-react-lite';
import { RouteComponentProps } from 'react-router-dom';
import LoaderComponent from '../../../app/layout/Loader';
import ActivityDetailedHeader from './ActivityDetailedHeader';
import ActivityDetaliedInfo from './ActivityDetaliedInfo';
import ActivityDetaledChats from './ActivityDetaledChats';
import ActivityDetaliedSideBar from './ActivityDetaliedSideBar';

interface DetailParams {
  id: string;
}

const ActivityDetails: FC<RouteComponentProps<DetailParams>> = ({ match }) => {
  const activityStore = useContext(ActivityStore);
  const { activity, loadActivity, loadingInitial } = activityStore;

  useEffect(() => {
    loadActivity(match.params.id);
  }, [loadActivity, match.params.id])

  if (loadingInitial || !activity) return <LoaderComponent content={"Loading activity..."} />

  return (
    <Grid>
      <Grid.Column width={10}>
        <ActivityDetailedHeader activity={activity} />
        <ActivityDetaliedInfo activity={activity} />
        <ActivityDetaledChats />
      </Grid.Column>
      <Grid.Column width={6}>
        <ActivityDetaliedSideBar />
      </Grid.Column>
    </Grid>
  )
}

export default observer(ActivityDetails);
