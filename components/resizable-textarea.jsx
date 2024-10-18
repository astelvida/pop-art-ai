'use client'

import React, { useRef, useEffect, useState } from 'react'
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Paperclip, ArrowUp } from "lucide-react"

export default function ResizableTextarea() {
  const [inputValue, setInputValue] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    const textarea = textareaRef.current
    if (!textarea) return

    const resizeTextarea = () => {
      textarea.style.height = 'auto'
      textarea.style.height = `${textarea.scrollHeight}px`
    }

    textarea.addEventListener('input', resizeTextarea)
    
    // Initial resize
    resizeTextarea()

    return () => {
      textarea.removeEventListener('input', resizeTextarea)
    }
  }, [])

  const handleSubmit = () => {
    console.log('Submitted:', inputValue)
    // Add your submit logic here
    setInputValue('')
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
    }
  }

  return (
    <div className="w-full max-w-md mx-auto relative">
      <Textarea
        ref={textareaRef}
        placeholder="Ask v0 a question..."
        className="min-h-[40px] resize-none overflow-hidden pr-10 pb-10"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
      />
      <Button 
        variant="ghost" 
        size="icon" 
        className="absolute left-2 bottom-2 text-muted-foreground hover:text-foreground"
      >
        <Paperclip className="h-4 w-4" />
        <span className="sr-only">Attach file</span>
      </Button>
      <Button 
        variant="ghost" 
        size="icon" 
        className="absolute right-2 bottom-2 text-muted-foreground hover:text-foreground"
        onClick={handleSubmit}
        disabled={!inputValue.trim()}
      >
        <ArrowUp className="h-4 w-4" />
        <span className="sr-only">Submit</span>
      </Button>
    </div>
  )
}