import React from 'react'
import { useParams } from 'react-router-dom'

const AnotherUser = () => {
    const {anotherUserId} = useParams();
  return (
    <div>
      hey AnotherUser page ,{anotherUserId}
    </div>
  )
}

export default AnotherUser
