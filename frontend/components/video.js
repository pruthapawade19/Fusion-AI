"use client";

import { useState } from "react";
import Container from "./container";

const Video = () => {
  const [playVideo, setPlayVideo] = useState(false);
  return (
    <Container>
      <div className="w-full max-w-4xl mx-auto overflow-hidden lg:mb-20 rounded-2xl ">
        <iframe
          width="100%"
          height="500"
          src="https://www.youtube.com/embed/nnZRBAzW3CA?si=lui7Pgf4JM0_a37t"
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture allowFullScreen "
        ></iframe>
      </div>
    </Container>
  );
};

export default Video;
