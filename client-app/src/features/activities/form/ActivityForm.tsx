import React, { FC, useState, FormEvent, useContext } from 'react';
import { Segment, Form, Button } from 'semantic-ui-react';
import { IActivity } from '../../../app/models/activity';
import { v4 as uuid } from 'uuid';
import ActivityStore from '../../../app/stores/activityStore';
import { observer } from 'mobx-react-lite';

interface IProps {
  activity: IActivity;
}
const ActivityForm: FC<IProps> = ({ activity: initialFromState }) => {
  const activityStore = useContext(ActivityStore);
  const { createActivity, submitting, editActivity, cancelFromOpen } = activityStore;

  const initializeForm = () => {
    if (initialFromState) {
      return initialFromState;
    } else {
      return {
        id: '',
        title: '',
        description: '',
        category: '',
        date: '',
        city: '',
        venue: '',
      }
    }
  };

  const [activity, setActivity] = useState<IActivity>(initializeForm);

  const handleSubmitForm = () => {
    if (activity.id.length <= 0) {
      let newActivity = {
        ...activity,
        id: uuid()
      };
      createActivity(newActivity);
    } else {
      editActivity(activity);
    }
  };
  const handleInputChange = (event: FormEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.currentTarget;
    setActivity({ ...activity, [name]: value });
  };

  return (
    <Segment clearing>
      <Form onSubmit={handleSubmitForm}>
        <Form.Input placeholder='Title' value={activity.title} name="title" onChange={handleInputChange} />
        <Form.TextArea rows={2} placeholder='Description' value={activity.description} name="description" onChange={handleInputChange} />
        <Form.Input placeholder='Category' value={activity.category} name="category" onChange={handleInputChange} />
        <Form.Input type='datetime-local' placeholder='Date' value={activity.date} name="date" onChange={handleInputChange} />
        <Form.Input placeholder='Venue' value={activity.venue} name="venue" onChange={handleInputChange} />
        <Form.Input placeholder='City' value={activity.city} name="city" onChange={handleInputChange} />
        <Button loading={submitting} floated="right" positive type="submit" content="Submit" />
        <Button floated="right" type="text" content="Cancel" onClick={cancelFromOpen} />
      </Form>
    </Segment>
  )
}

export default observer(ActivityForm);
