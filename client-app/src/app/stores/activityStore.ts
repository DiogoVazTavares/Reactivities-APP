import { observable, action, computed, configure, runInAction } from 'mobx';
import { createContext, SyntheticEvent } from 'react';
import { IActivity } from '../models/activity';
import agent from '../api/agent';

configure({ enforceActions: 'observed' });
class ActivityStore {
  @observable activityRegistry = new Map();
  @observable activity: IActivity | null = null;
  @observable loadingInitial = false;
  @observable submitting = false;
  @observable target = '';

  @computed get activitiesByDate() {
    return this.groupActivitiesByDate(Array.from(this.activityRegistry.values()));
  };

  groupActivitiesByDate = (activities: IActivity[]) => {
    const acitvitiesSorted = activities.sort((a, b) => Date.parse(a.date) - Date.parse(b.date));

    return Object.entries(acitvitiesSorted.reduce((activities, activity) => {
      const date = activity.date.split("T")[0];
      activities[date] = activities[date] ? [...activities[date], activity] : [activity];
      return activities;
    }, {} as { [key: string]: IActivity[] }))
  };

  @action loadActivities = async () => {
    this.loadingInitial = true;
    try {
      const activities = await agent.Activities.list();
      runInAction('loading activities', () => {
        activities.forEach(activity => {
          activity.date = activity.date.split('.')[0];
          this.activityRegistry.set(activity.id, activity);
          this.loadingInitial = false;
        });
      });
    }
    catch (error) {
      runInAction('loading activities error', () => this.loadingInitial = false);
      console.log(error);
    }
  };

  @action loadActivity = async (id: string) => {
    const activity = this.getActivity(id);

    if (activity) {
      this.activity = activity;
    } else {
      try {
        this.loadingInitial = true;
        const activity = await agent.Activities.details(id);
        runInAction('getting activity', () => {
          this.activity = activity;
          this.loadingInitial = false;
        });
      }
      catch (error) {
        runInAction('getting activity error', () => this.loadingInitial = false);
        //Don't need to throw because we have access to history in agent.ts
        // throw error;
        console.log(error);
      }
    }
  };

  @action createActivity = async (activity: IActivity) => {
    this.submitting = true;
    try {
      await agent.Activities.create(activity);
      runInAction('create activities', () => {
        this.activityRegistry.set(activity.id, activity);
        this.activity = activity;
      });
    } catch (error) {
      runInAction('create activities error', () => this.submitting = false);
      console.log(error);
    }
  };

  @action editActivity = async (activity: IActivity) => {
    this.submitting = true;
    try {
      await agent.Activities.update(activity);
      runInAction('edit activity', () => {
        this.activityRegistry.set(activity.id, activity);
        this.activity = activity;
        this.submitting = false;
      });
    } catch (error) {
      runInAction('edit activity error', () => this.submitting = false);
      console.log(error);
    }
  };

  @action deleteActivity = async (event: SyntheticEvent<HTMLButtonElement>, id: string) => {
    this.submitting = true;
    this.target = event.currentTarget.name;
    try {
      await agent.Activities.delete(id);
      runInAction('delete activity', () => {
        this.activityRegistry.delete(id);
        this.activity = null;
        this.target = '';
      });
    } catch (error) {
      runInAction('delete activity error', () => {
        this.target = '';
        this.submitting = false;
      });
      console.log(error);
    }
  };

  getActivity = (id: string) => {
    return this.activityRegistry.get(id);
  }
  @action clearActivity = () => {
    this.activity = null;
  };
}

export default createContext(new ActivityStore());