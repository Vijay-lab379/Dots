import React from 'react'
import { useParams } from 'react-router-dom'

function User() {
    const { userId } = useParams()
    return (
        <div className='bg-orange-500 max h-0.5 text-center py-50 text-2xl'>User:{userId}</div>
    )
}

export default User