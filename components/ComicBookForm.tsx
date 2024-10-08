import React from 'react'

const ComicBookForm: React.FC = () => {
  return (
    <form className="w-full md:w-1/2 space-y-4">
      <div>
        <label htmlFor="scene-description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Scene Description
        </label>
        <textarea
          id="scene-description"
          className="w-full p-2 border rounded-md"
          rows={4}
          placeholder="Describe your comic book scene here..."
          defaultValue="A superhero soaring through a futuristic cityscape, cape billowing in the wind."
        />
      </div>
      <div>
        <label htmlFor="mood-selector" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Mood
        </label>
        <select
          id="mood-selector"
          className="w-full p-2 border rounded-md"
          defaultValue="energetic"
        >
          <option value="energetic">Energetic</option>
          <option value="mysterious">Mysterious</option>
          <option value="dramatic">Dramatic</option>
          <option value="humorous">Humorous</option>
          <option value="dark">Dark</option>
        </select>
      </div>
      <button
        type="submit"
        className="w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
      >
        Generate Comic Image
      </button>
    </form>
  )
}

export default ComicBookForm
