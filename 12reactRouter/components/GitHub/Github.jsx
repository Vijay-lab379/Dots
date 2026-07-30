import React, { useEffect, useState } from 'react'
import { useLoaderData, useParams } from 'react-router-dom'

function Github() {
    const data = useLoaderData()

    // const [data, setData] = useState([])
    // useEffect(() => {
    //     fetch("https://api.github.com/users/Vijay-lab379")

    //         .then((res) => res.json())
    //         .then((data) => {
    //             console.log(data);
    //             setData(data)
    //         })
    // }, [])

    return (
        <>
            <div className='rounded-4xl text-center  flex m-4 bg-gray-900 text-white p-4 text-2xl'>
                <img className='h-50 rounded-4xl mx-30 self-center-safe' src={data.avatar_url} alt="profilePic" />
                <p className='py-30 y-50'>{data.bio}</p>
            </div>
        </>
    )
}

export default Github

export async function githubInfoLoader() {
    const response = await fetch(`https://api.github.com/users/Vijay-lab379`).then((res) => res.json())
    console.log(response);
    return response
}