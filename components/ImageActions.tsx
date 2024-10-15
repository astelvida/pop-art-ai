// import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Settings, Share, ArrowDownToLine, CheckCircle, Trash, Loader2 } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { saveAiImage } from '@/actions/queries'

export function ImageActions({ imageUrl, prompt }: { imageUrl: string, prompt: string }) {
  // const [isSaving, setIsSaving] = useState(false)
  // const [isSaved, setIsSaved] = useState(false)

  function downloadFile(url: string) {
    const link = document.createElement('a');
    link.href = url;
    link.download = 'generated-image.jpg';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  async function handleSave() {
    // setIsSaving(true)
    try {
      await saveAiImage({ url: imageUrl, prompt })
      // setIsSaved(true)
    } catch (error) {
      console.error('Failed to save image:', error)
    } finally {
      // setIsSaving(false)
    }
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
        className="absolute top-4 left-4 right-4 flex flex-wrap justify-center gap-2"
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <Button
            variant="secondary"
            size="sm"
            className="flex items-center space-x-1"
          >
            <Settings className="w-4 h-4" />
            <span className="text-sm font-medium">Tweak it</span>
          </Button>
        </motion.div>
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Button
            variant="secondary"
            size="sm"
            className="flex items-center space-x-1"
          >
            <Share className="w-4 h-4" />
            <span className="text-sm font-medium">Share</span>
          </Button>
        </motion.div>
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <Button
            variant="secondary"
            size="sm"
            className="flex items-center space-x-1"
            onClick={() => downloadFile(imageUrl)}
          >
            <ArrowDownToLine className="w-4 h-4" />
            <span className="text-sm font-medium">Download</span>
          </Button>
        </motion.div>
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <Button
            variant="secondary"
            size="sm"
            className="flex items-center space-x-1"
            onClick={handleSave}
          // disabled={isSaving || isSaved}
          >
            <span className="text-sm font-medium">Save</span>
            {/* {isSaving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : isSaved ? (
              <CheckCircle className="w-4 h-4 text-green-500" />
            ) : (
              <CheckCircle className="w-4 h-4" />
            )}
            <span className="text-sm font-medium">
              {isSaving ? 'Saving...' : isSaved ? 'Saved' : 'Save'}
            </span> */}
          </Button>
        </motion.div>
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <Button
            variant="secondary"
            size="sm"
            className="flex items-center space-x-1"
          >
            <Trash className="w-4 h-4" />
            <span className="text-sm font-medium">Delete</span>
          </Button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
