import React from 'react';
import { SparklesText } from './sparkles-text';

export const SparklesTextDemo = () => {
  return (
    <div className="flex min-h-[200px] w-full flex-col items-center justify-center overflow-hidden bg-black">
      <SparklesText>
        <h1 className="bg-gradient-to-r from-white to-gray-500 bg-clip-text text-center text-4xl font-bold text-transparent md:text-7xl">
          Featured Video
        </h1>
      </SparklesText>
      <p className="mt-4 text-center text-gray-500">
        Hover over the text to see the sparkles effect
      </p>
    </div>
  );
}; 