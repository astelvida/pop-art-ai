"use client"

import { Download } from "lucide-react";
import { Button } from "./ui/button";

interface DownloadButtonProps {
  imageUrl: string;
}

export function DownloadButton({ imageUrl }: DownloadButtonProps) {
  const handleDownload = async () => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.style.display = "none";
      a.href = url;
      a.download = "image.png";
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading image:", error);
    }
  };

  return (
    <button
      onClick={handleDownload}
      className="rounded-full bg-white bg-opacity-75 p-2 shadow-sm transition-colors duration-300 hover:bg-opacity-100 focus:outline-none"
      aria-label="Download image"
    >
      <Download className="h-5 w-5 text-gray-600" />
    </button>
  );
}
