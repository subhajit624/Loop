import React from 'react'
import { useParams } from 'react-router-dom'

const Conversation = () => {
  const {anotherUserId} = useParams();


  return (
    <div>
      conversation {anotherUserId}
    </div>
  )
}

export default Conversation
