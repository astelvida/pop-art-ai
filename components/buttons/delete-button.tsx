import React from 'react'
import { Button } from '../ui/button'
import { Trash2 } from 'lucide-react'
import { deleteAiImage } from '@/actions/queries'

const DeleteButton = ({ imageId }: { imageId: string }) => {
  const deleteAiImageWithId = deleteAiImage.bind(null, imageId)
  return (
    <form action={deleteAiImageWithId}>
      <Button type='submit' variant='secondary' size='icon'>
        <Trash2 className='h-4 w-4' />
        <span className="sr-only">Delete</span>
      </Button>
    </form>
  )
}

export default DeleteButton
