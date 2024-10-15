import React from 'react';
import Image from 'next/image';
import { Download, Trash2, Save, Heart } from 'lucide-react';
import { Button } from './ui/button';

interface ImageGridProps {
  images: string[];
  onDelete: (index: number) => void;
  onSave: (index: number) => void;
  onLike: (index: number) => void;
}

const ImageGrid: React.FC<ImageGridProps> = ({ images, onDelete, onSave, onLike }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {images.map((imageUrl, index) => (
        <div key={index} className="relative group">
          <Image
            src={imageUrl}
            alt={`Generated image ${index + 1}`}
            width={300}
            height={300}
            className="w-full h-auto rounded-lg"
          />
          <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center space-x-2">
            <Button size="icon" variant="ghost" onClick={() => window.open(imageUrl, '_blank')}>
              <Download className="h-4 w-4" />
            </Button>
            <Button size="icon" variant="ghost" onClick={() => onDelete(index)}>
              <Trash2 className="h-4 w-4" />
            </Button>
            <Button size="icon" variant="ghost" onClick={() => onSave(index)}>
              <Save className="h-4 w-4" />
            </Button>
            <Button size="icon" variant="ghost" onClick={() => onLike(index)}>
              <Heart className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ImageGrid;
