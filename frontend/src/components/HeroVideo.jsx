import React from "react";

const HeroVideo = () => {
  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Full-width background video */}
      <video
        src="/v6.mp4"
        autoPlay
        loop
        muted
        playsInline
        className="w-full h-full object-cover"
      />

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent" />

      {/* Quote overlay */}
      <div className="absolute inset-0 flex items-center justify-center text-center px-4">
        <h1
          className="text-white text-3xl sm:text-4xl md:text-5xl leading-snug"
          style={{ fontFamily: `'Abril Fatface', cursive` }}
        >
          “Style is a way to say who you are<br className="hidden sm:block" /> without having to speak.”
        </h1>
      </div>
    </div>
  );
};

export default HeroVideo;
