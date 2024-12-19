"use client";
import React from "react";
import Container from "./container";
import { Disclosure } from "@headlessui/react";
import { ChevronUpIcon } from "@heroicons/react/24/solid";

const Faq = () => {
  return (
    <Container className="!p-0">
      <div className="w-full max-w-2xl p-2 mx-auto rounded-2xl">
        {faqdata.map((item) => (
          <div key={item.question} className="mb-5">
            <Disclosure>
              {({ open }) => (
                <>
                  <Disclosure.Button className="flex items-center justify-between w-full px-4 py-4 text-lg text-left text-gray-800 rounded-lg bg-gray-50 hover:bg-gray-100 focus:outline-none focus-visible:ring focus-visible:ring-indigo-100 focus-visible:ring-opacity-75 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700">
                    <span>{item.question}</span>
                    <ChevronUpIcon
                      className={`${
                        open ? "transform rotate-180" : ""
                      } w-5 h-5 text-indigo-500`}
                    />
                  </Disclosure.Button>
                  <Disclosure.Panel className="px-4 pt-4 pb-2 text-gray-500 dark:text-gray-300">
                    {item.answer}
                  </Disclosure.Panel>
                </>
              )}
            </Disclosure>
          </div>
        ))}
      </div>
    </Container>
  );
};

const faqdata = [
  {
    question: "What is FusionAI?",
    answer: "FusionAI is a tool that extracts text from images and generates concise summaries for quick comprehension.",
  },
  {
    question: "How do I use FusionAI?",
    answer: "Simply upload an image containing text, and FusionAI will extract the text and provide a summarized version of it.",
  },
  {
    question: "Which file formats are supported?",
    answer: "You can upload images in popular formats such as JPEG, PNG, and GIF for text extraction.",
  },
  
  {
    question: "Can FusionAI handle handwritten text?",
    answer: "FusionAI is optimized for printed text but can also extract handwritten text, though accuracy may vary.",
  },
];

export default Faq;
