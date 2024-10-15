import { ImageIcon } from "lucide-react"

export function EmptyState({ error }: { error: string | null }) {
  return (
    <div className="flex flex-col items-center justify-center h-full p-4 text-center">
      <ImageIcon className="h-12 w-12 text-muted-foreground mb-4" />
      <h3 className="text-lg font-medium mb-2">
        {error ? "Error" : "No image generated yet"}
      </h3>
      <p className="text-sm text-muted-foreground">
        {error || "Enter a prompt and click 'Generate Image' to create an image."}
      </p>
    </div>
  )
}
