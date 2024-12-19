"use client";
import Navbar from "@/components/Navbar";
import Head from "next/head";
import Hero from "@/components/hero";
import SectionTitle from "@/components/sectionTitle";

import { benefitOne } from "@/components/data";

import Video from "@/components/video";
import Benefits from "@/components/benefits";
import Footer from "@/components/footer";
import Faq from "@/components/faq";

export default function Home() {
  return (
   <div>

      <Navbar  />
      
      <Hero/>

      <SectionTitle title=" Why should you use FusionAI">
      Unlock the power of seamless text extraction and summarization with FusionAI! Turn images into concise, easy-to-read summaries in just a few clicks.
      </SectionTitle>
      <Benefits data={benefitOne} />
      <SectionTitle
        pretitle="Watch a video"
        title="Learn what actually FusionAI does ?"
      ></SectionTitle>
      <Video />
      
      <SectionTitle pretitle="FAQ" title="Frequently Asked Questions">
      
      </SectionTitle>
      <Faq />
      {/* <Cta /> */}
      <Footer />
    
    
   </div>
  );
}
