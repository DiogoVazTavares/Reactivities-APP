import React, { FC, useContext, useEffect } from "react";
import { Grid } from "semantic-ui-react";
import { observer } from "mobx-react-lite";
import { RouteComponentProps } from "react-router-dom";
import LoaderComponent from "../../../app/layout/Loader";
import ActivityDetailedHeader from "./ActivityDetailedHeader";
import ActivityDetaliedInfo from "./ActivityDetaliedInfo";
import ActivityDetaledChats from "./ActivityDetaledChats";
import ActivityDetaliedSideBar from "./ActivityDetaliedSideBar";
import { RootStoreContext } from "../../../app/stores/rootStore";

interface DetailParams {
  id: string;
}

const ActivityDetails: FC<RouteComponentProps<DetailParams>> = ({
  match,
  history,
}) => {
  const rootStore = useContext(RootStoreContext);
  const { activity, loadActivity, loadingInitial } = rootStore.activityStore;

  useEffect(() => {
    loadActivity(match.params.id);
    //Don't need to and the error here because we do it on agent.ts
    //.catch(() => history.push('/notFound'));
  }, [loadActivity, match.params.id, history]);

  if (loadingInitial)
    return <LoaderComponent content={"Loading activity..."} />;

  if (!activity) return <h2>Activity not found</h2>;

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
  );
};

export default observer(ActivityDetails);
