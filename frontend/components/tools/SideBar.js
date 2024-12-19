import React, { useState } from 'react';
import { MdGeneratingTokens } from "react-icons/md";
import { LuText } from "react-icons/lu";
import { MdHome } from "react-icons/md";
import { MdPerson } from "react-icons/md";
import { IoLogOut } from "react-icons/io5";
import Cookies from 'js-cookie'; // Import js-cookie for handling cookies
import { useRouter } from 'next/navigation'; // Import useRouter for navigation
import { IoSettings } from "react-icons/io5";

export default function SideBar({ children, tab, setTab }) {
    const [sidebarOpen, setSidebarOpen] = useState(false); // Manage sidebar open/close state
    const router = useRouter(); // Create a router instance

    // Handle logout functionality
    const handleLogout = () => {
        Cookies.remove('authToken'); // Clear the authToken cookie
        router.push('/'); // Redirect to home page
    };

    // Handle sidebar toggle
    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    return (
        <div>
            <nav className="fixed top-0 z-50 w-full bg-white border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700">
                <div className="px-3 py-3 lg:px-5 lg:pl-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center justify-start rtl:justify-end">
                            {/* Hamburger button */}
                            <button
                                data-drawer-target="logo-sidebar"
                                aria-controls="logo-sidebar"
                                type="button"
                                onClick={toggleSidebar} // Toggle sidebar on click
                                className="inline-flex items-center p-2 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
                            >
                                <span className="sr-only">Open sidebar</span>
                                <svg
                                    className="w-6 h-6"
                                    aria-hidden="true"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        clipRule="evenodd"
                                        fillRule="evenodd"
                                        d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"
                                    ></path>
                                </svg>
                            </button>
                            <a href="https://flowbite.com" className="flex ms-2 md:me-24">
                                <img src="/logo.svg" className="h-8 me-3" alt="FlowBite Logo" />
                                <span className="self-center text-xl font-semibold sm:text-2xl whitespace-nowrap dark:text-white">FusionAI</span>
                            </a>
                        </div>
                        <div className="flex items-center">
                            <div className="flex items-center ms-3">
                                <div>
                                    <button
                                        type="button"
                                        className="flex text-sm bg-gray-800 rounded-full focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600"
                                        aria-expanded="false"
                                        data-dropdown-toggle="dropdown-user"
                                    >
                                        <span className="sr-only">Open user menu</span>
                                        <MdPerson className="w-8 h-8 rounded-full" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Sidebar */}
            <aside
                id="logo-sidebar"
                className={`fixed top-0 left-0 z-40 w-64 h-screen pt-20 transition-transform ${
                    sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                } bg-white border-r border-gray-200 sm:translate-x-0 dark:bg-gray-800 dark:border-gray-700`}
                aria-label="Sidebar"
            >
                <div className="h-full px-3 pb-4 overflow-y-auto bg-white dark:bg-gray-800">
                    <ul className="space-y-2 font-medium">
                        <li>
                            <a
                                href="/"
                                className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
                                onClick={() => setTab('home')}
                            >
                                <MdHome className="w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
                                <span className="flex-1 ms-3 whitespace-nowrap">Home</span>
                            </a>
                        </li>
                        <li>
                            <a href="#" className={`flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group ${tab === 'generate' ? 'bg-gray-200 dark:bg-gray-700' : ''}`}
                                onClick={() => setTab('generate')}>
                                <IoSettings className={`w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white ${tab === 'generate' ? 'text-gray-900 dark:text-white' : ''}`} />
                                <span className="flex-1 ms-3 whitespace-nowrap">Generate Questions</span>
                            </a>
                        </li>
                        <li>
                            <a
                                href="#"
                                className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
                                onClick={() => setTab('image-summary')}
                            >
                                <MdGeneratingTokens className="w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
                                <span className="flex-1 ms-3 whitespace-nowrap">Image Summarizer</span>
                            </a>
                        </li>
                        <li>
                            <a
                                href="#"
                                className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
                                onClick={() => setTab('image-caption')}
                            >
                                <LuText className="w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
                                <span className="flex-1 ms-3 whitespace-nowrap">Image Captioning</span>
                            </a>
                        </li>
                        <li>
                            <a
                                href="#"
                                className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
                                onClick={handleLogout}
                            >
                                <IoLogOut className="w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
                                <span className="flex-1 ms-3 whitespace-nowrap">Logout</span>
                            </a>
                        </li>
                    </ul>
                </div>
            </aside>

            <div className="p-4 sm:ml-64">
                <div className="mt-14">{children}</div>
            </div>
        </div>
    );
}
