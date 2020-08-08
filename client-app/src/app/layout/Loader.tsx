import React, { FC } from 'react'
import { Dimmer, Loader } from 'semantic-ui-react'
interface IProps { inverted?: boolean, content: string };

const LoaderComponent: FC<IProps> = ({ inverted, content }) => {
  return (
    <Dimmer active inverted={inverted}>
      <Loader content={content} />
    </Dimmer>

  )
}

export default LoaderComponent
