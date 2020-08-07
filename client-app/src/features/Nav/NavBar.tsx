import React, { FC, useContext } from 'react'
import { Menu, Button, Container } from 'semantic-ui-react'
import ActivityStore from '../../app/stores/activityStore';
import { observer } from 'mobx-react-lite';

const NavBar: FC = () => {
  const activityStore = useContext(ActivityStore);
  const { openCreateForm } = activityStore;

  return (
    <Menu fixed='top' inverted>
      <Container>
        <Menu.Item>
          <img src='/assets/logo.png' alt='logo' style={{ marginRight: 10 }} />
          Reactivities
        </Menu.Item>
        <Menu.Item name='Activities' />
        <Menu.Item>
          <Button positive content='Create Activity' onClick={openCreateForm} />
        </Menu.Item>
      </Container>
    </Menu>
  )
}

export default observer(NavBar);