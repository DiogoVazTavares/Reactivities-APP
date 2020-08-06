import React, { FC } from 'react'
import { Dimmer, Loader as LoaderComponent } from 'semantic-ui-react'
interface IProps { inverted?: boolean, content: string };

const Loader: FC<IProps> = ({ inverted, content }) => {
  return (
    <Dimmer active inverted={inverted}>
      <LoaderComponent content={content} />
    </Dimmer>

  )
}

export default Loader
