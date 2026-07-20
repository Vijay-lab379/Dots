import React from 'react'

function Card({
  username = "Something",
  post= "Not Marked yet",
  id = "not defined",
  imgUrl = "https://tailwindcss.com/_next/static/media/cover.0g8-x6e87bh6a.png", }) {

  return (
    <div className="flex flex-col items-center gap-6 p-3 md:flex-row md:gap-8 rounded-2xl">
      <div>
        <img className="size-48 shadow-xl rounded-md" alt="" src={imgUrl} />
      </div>
      <div className="flex flex-col items-center md:items-start">
        <span className="text-2xl font-medium">{username}</span>
        <span className="font-medium text-sky-500">{post}</span>
        <span className="flex gap-2 font-medium text-gray-600 dark:text-gray-400">
          <span>{id}</span>
          <span>·</span>
          <span>2025</span>
        </span>
      </div>
    </div>
  )
}

export default Card
