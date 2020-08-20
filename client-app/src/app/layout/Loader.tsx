import React, { FC } from 'react'
import { Dimmer, Loader } from 'semantic-ui-react'
interface IProps { content: string };

const LoaderComponent: FC<IProps> = ({ content }) => {
  return (
    <Dimmer active inverted >
      <Loader content={content} />
    </Dimmer>

  )
}

export default LoaderComponent
