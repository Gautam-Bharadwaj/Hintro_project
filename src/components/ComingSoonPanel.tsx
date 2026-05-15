"use client";

import { IconSparkles } from "./icons";

interface Props {
  title: string;
}

export default function ComingSoonPanel({ title }: Props) {
  return (
    <div className="flex flex-1 items-center justify-center px-4 py-10 lg:py-16">
      <div className="max-w-2xl w-full text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary-soft text-accent">
          <IconSparkles width={26} height={26} />
        </div>
        <h2 className="text-lg font-semibold text-text">{title}</h2>
        <p className="mt-1.5 text-sm text-text-soft mb-8">
          This area is still in the works. In the meantime, you can watch our tutorial below.
        </p>
        
        <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-border bg-black shadow-lg">
          <video
            src="/Tutorial_video.mov"
            controls
            className="h-full w-full object-contain"
          >
            Your browser does not support the video tag.
          </video>
        </div>
      </div>
    </div>
  );
}
