"use client";
import {
  FaceSmileIcon,
  DocumentMagnifyingGlassIcon,
  CursorArrowRaysIcon,
  DevicePhoneMobileIcon,
  AdjustmentsHorizontalIcon,
  SunIcon,
  DocumentIcon,
  BanknotesIcon,
  EyeDropperIcon,
  BookmarkIcon,
  CogIcon,
} from "@heroicons/react/24/solid";

import FusionAIBanner from "@/public/features.png";

const benefitOne = {
  title: "Key Features",
  desc: "FusionAI makes it simple to extract text from images and generate concise summaries with just a few clicks. Streamline your workflow by converting image content into readable, summarized text efficiently.",
  image: FusionAIBanner,
  bullets: [
    {
      title: "Text Extraction",
      desc: "Upload images and easily extract readable text for further use.",
      icon: <DocumentMagnifyingGlassIcon />,
    },
    {
      title: "Summarization",
      desc: "Generate short and concise summaries from extracted text automatically.",
      icon: <BookmarkIcon />,
    },
    {
      title: "Handwriting Support",
      desc: "Extract text from handwritten documents for added convenience.",
      icon: <CursorArrowRaysIcon />,
    },
  ],
};

export { benefitOne };
