import React, { FC } from 'react'
import { Menu, Button, Container } from 'semantic-ui-react'

interface IProps {
  openCreateForm: () => void;
}
export const NavBar: FC<IProps> = ({openCreateForm}) => {
  return (
    <Menu fixed='top' inverted>
      <Container>
        <Menu.Item>
          <img src='/assets/logo.png' alt='logo' style={{marginRight: 10}}/>
          Reactivities
        </Menu.Item>
        <Menu.Item name='Activities' />
        <Menu.Item>
          <Button positive content='Create Activity' onClick={openCreateForm}/>
        </Menu.Item>
      </Container>
    </Menu>
  )
}
