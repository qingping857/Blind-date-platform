'use client';

import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';

interface ProfileImageUploadProps {
  value?: string[];
  onChange?: (urls: string[]) => void;
  maxFiles?: number;
  maxSize?: number;
}

export function ProfileImageUpload({
  value = [],
  onChange,
  maxFiles = 3,
  maxSize = 5 * 1024 * 1024, // 5MB
}: ProfileImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (value.length + acceptedFiles.length > maxFiles) {
      toast({
        title: '超出最大文件数限制',
        description: `最多只能上传${maxFiles}张图片`,
        variant: 'destructive',
      });
      return;
    }

    setIsUploading(true);
    try {
      const formData = new FormData();
      acceptedFiles.forEach((file) => {
        formData.append('files', file);
      });

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('上传失败');
      }

      const data = await response.json();
      const newUrls = [...value, ...data.urls];
      onChange?.(newUrls);

      toast({
        title: '上传成功',
        description: '图片已成功上传',
      });
    } catch (error: any) {
      console.error('上传失败:', error);
      toast({
        title: '上传失败',
        description: error.message || '图片上传失败，请重试',
        variant: 'destructive',
      });
    } finally {
      setIsUploading(false);
    }
  }, [value, maxFiles, onChange, toast]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif']
    },
    maxSize,
    disabled: isUploading,
  });

  const removeImage = (index: number) => {
    const newUrls = value.filter((_, i) => i !== index);
    onChange?.(newUrls);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        {value.map((url, index) => (
          <div key={index} className="relative aspect-square group">
            <div className="relative w-full h-full">
              <Image
                src={url}
                alt={`照片 ${index + 1}`}
                fill
                className="object-cover rounded-lg"
              />
              <Button
                variant="destructive"
                size="sm"
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => removeImage(index)}
              >
                删除
              </Button>
            </div>
          </div>
        ))}
        {value.length < maxFiles && (
          <div
            {...getRootProps()}
            className={`aspect-square flex items-center justify-center border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
              isDragActive
                ? 'border-primary bg-primary/10'
                : 'border-muted-foreground/25 hover:border-muted-foreground/50'
            }`}
          >
            <input {...getInputProps()} />
            <div className="text-center">
              {isUploading ? (
                <p>上传中...</p>
              ) : isDragActive ? (
                <p>放开以上传图片</p>
              ) : (
                <p>
                  拖拽图片到这里，
                  <br />
                  或点击上传
                </p>
              )}
            </div>
          </div>
        )}
      </div>
      <p className="text-sm text-muted-foreground">
        最多上传{maxFiles}张照片，每张照片不超过{maxSize / 1024 / 1024}MB
      </p>
    </div>
  );
} 