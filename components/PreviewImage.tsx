import React from 'react'

const PreviewImage: React.FC = ({ imageUrl }) => {
  return (
    <div className="w-full md:w-1/2 flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-md">
      <img src={imageUrl} alt="Preview" />
      <p className="text-gray-500 dark:text-gray-400">Preview image will appear here</p>
    </div>
  )
}

export default PreviewImage
