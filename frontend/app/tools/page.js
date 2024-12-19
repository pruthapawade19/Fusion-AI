"use client"
import SideBar from '@/components/tools/SideBar'
import ImageSumary from '@/components/tools/ImageSumary';
import ImageCaption from '@/components/tools/ImageCaption';
import {useState} from 'react';
import GenerateQuestion from '@/components/tools/GenerateQuestion';

export default function page() {
    const [tab, setTab] = useState('generate');
    return (
        <>
            <SideBar tab={tab} setTab={setTab}>
                {tab === 'image-summary' && <ImageSumary />}
                {tab === 'image-caption' && <ImageCaption />}
                {tab === 'generate' && <GenerateQuestion />}
            </SideBar>
        </>
    )
}
