import React from 'react'
import Template_1 from './Template_1'
import Template_2 from './Template_2'


const GorgeousTemplate = (props) => {
  const { templateId } = props

  switch (templateId) {
    case 1:
      return <Template_1 {...props} />
    case 2:
      return <Template_2 {...props} />

    default:
      return <Template_1 {...props} />
  }
}

export default GorgeousTemplate
