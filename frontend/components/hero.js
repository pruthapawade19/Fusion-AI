"use client";
import Image from "next/image";
import Container from "./container";

import heroImg from "@/public/home.png";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const Hero = () => {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState();

  useEffect(() => {
    const uname = localStorage.getItem("username");
    if (uname !== undefined) {
      setUsername(uname);
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  function handleGetStarted() {
    if (isLoggedIn) {
      router.push("/tools");
    } else {
      router.push("/auth/login");
    }
  }

  return (
    <>
    <div className="lg:ml-32">
      <Container className="flex flex-wrap mt-16">
        <div className="flex items-center w-full lg:w-1/2">
          <div className="max-w-2xl mb-8">
            <h1 className="text-4xl font-bold leading-snug tracking-tight text-gray-800 lg:text-4xl lg:leading-tight xl:text-6xl xl:leading-tight dark:text-white">
              Simplify Text Extraction & Summarization with FusionAI!
            </h1>
            <p className="py-5 text-xl leading-normal text-gray-500 lg:text-xl xl:text-2xl dark:text-gray-300">
              FusionAI helps you extract text from images and create
              concise summaries effortlessly.
            </p>

            <div className="flex flex-col items-start space-y-3 sm:space-x-4 sm:space-y-0 sm:items-center sm:flex-row">
              <button
                onClick={handleGetStarted}
                className="px-8 py-4 text-lg font-medium text-center text-white bg-indigo-600 rounded-md"
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-center w-full lg:w-1/2">
          <div className="">
            <Image
              src={heroImg}
              width=""
              height="617"
              className={"object-cover"}
              alt="Hero Illustration"
              loading="eager"
              placeholder="blur"
            />
          </div>
        </div>
      </Container>
      </div>
    </>
  );
};

export default Hero;
