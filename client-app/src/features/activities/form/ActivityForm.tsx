import React, { FC, useState, FormEvent } from 'react';
import { Segment, Form, Button } from 'semantic-ui-react';
import { IActivity } from '../../../app/models/activity';
import { v4 as uuid } from 'uuid';

interface IProps {
  setEditMode: (editMode: boolean) => void;
  activity: IActivity;
  createActivity: (activity: IActivity) => void;
  editActivity: (activity: IActivity) => void;
}
export const ActivityForm: FC<IProps> = ({ setEditMode, activity: initialFromState, createActivity, editActivity }) => {

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
        <Button floated="right" positive type="submit" content="Submit" />
        <Button floated="right" type="text" content="Cancel" onClick={() => setEditMode(false)} />
      </Form>
    </Segment>
  )
}
