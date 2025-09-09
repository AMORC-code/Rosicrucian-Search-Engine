import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent } from '@/components/Search/components/ui/dialog';
import { cn } from '@/lib/utils';
import { convertSrtToVtt } from '@/lib/subtitle-utils';

interface HeroVideoDialogProps {
  className?: string;
  animation?: 'fade' | 'slide';
  videoSrc: string;
  subtitlesSrc?: string;
  subtitlesLang?: string;
  thumbnailSrc?: string;
  thumbnailAlt?: string;
  onClose: () => void;
}

export function HeroVideoDialog({
  className,
  animation = 'fade',
  videoSrc,
  subtitlesSrc,
  subtitlesLang,
  thumbnailSrc,
  thumbnailAlt,
  onClose,
}: HeroVideoDialogProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [vttUrl, setVttUrl] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function loadSubtitles() {
      if (subtitlesSrc) {
        try {
          const url = await convertSrtToVtt(subtitlesSrc);
          if (mounted) {
            setVttUrl(url);
          }
        } catch (error) {
          console.error('Failed to load subtitles:', error);
        }
      }
    }

    loadSubtitles();

    return () => {
      mounted = false;
      // Cleanup blob URL
      if (vttUrl) {
        URL.revokeObjectURL(vttUrl);
      }
    };
  }, [subtitlesSrc]);

  const handleClose = () => {
    setIsOpen(false);
    if (vttUrl) {
      URL.revokeObjectURL(vttUrl);
    }
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent
        className={cn(
          'sm:max-w-[90vw] h-auto p-0 bg-black/95',
          'flex items-center justify-center',
          animation === 'fade' && 'animate-fade-in',
          animation === 'slide' && 'animate-slide-in-up',
          className
        )}
      >
        <div className="w-full max-h-[85vh] flex items-center">
          <video
            className="w-full"
            controls
            autoPlay
            crossOrigin="anonymous"
            poster={thumbnailSrc}
            preload="metadata"
          >
            <source src={videoSrc} type="video/mp4" />
            {vttUrl && (
              <track
                kind="subtitles"
                src={vttUrl}
                srcLang={subtitlesLang}
                label={subtitlesLang?.toUpperCase()}
                default
              />
            )}
            Your browser does not support the video tag.
          </video>
        </div>
      </DialogContent>
    </Dialog>
  );
}
