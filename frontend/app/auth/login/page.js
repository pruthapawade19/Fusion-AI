"use client"
import React, { useState } from 'react'
import { app } from '@/firebase/db'
import { useRouter } from 'next/navigation'
import Cookies from 'js-cookie'

export default function Page() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [error, setError] = useState('')
    const router = useRouter()

    const handleSubmit = async (e) => {
        e.preventDefault()

        // Clear previous errors
        setError('')

        // Firebase email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(email)) {
            setError('Please enter a valid email address.')
            return
        }

        try {
            // Sign in the user with Firebase authentication
            const userCredential = await app.auth().signInWithEmailAndPassword(email, password)

            // Get the ID token for the signed-in user
            const token = await userCredential.user.getIdToken()

            // Store the token in a cookie for future use
            Cookies.set('authToken', token, { expires: 7 }) // Cookie expires in 7 days

            console.log('User signed in, token stored in cookies')

            // Redirect to home page
            router.push('/')
        } catch (err) {
            setError(err.message || 'Something went wrong, please try again.')
        }
    }

    const toggleShowPassword = () => {
        setShowPassword((prevState) => !prevState)
    }

    return (
        <section className="bg-gray-50 dark:bg-gray-900">
            <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
                <a href="/" className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white">
                    <img className="w-8 h-8 mr-2" src="/logo.svg" alt="logo" />
                    FusionAI
                </a>
                <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                    <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                        <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                            Sign in to your account
                        </h1>
                        {error && (
                            <div className="text-red-600 font-semibold mb-2 text-center">
                                {error}
                            </div>
                        )}
                        <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
                            <div>
                                <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                    Your email
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    id="email"
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-orange-600 focus:border-orange-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                    placeholder="name@company.com"
                                    required
                                />
                            </div>
                            <div className="relative">
                                <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                    Password
                                </label>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    id="password"
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-orange-600 focus:border-orange-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={toggleShowPassword}
                                    className="absolute inset-y-0 right-3 flex items-center text-gray-500 dark:text-gray-400"
                                >
                                    {showPassword ? (
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                            <path d="M10 3C5.5 3 1.73 6.11.48 10.39a.75.75 0 000 .22c.25 1.11.79 2.15 1.5 3.04A10.02 10.02 0 0010 17a10.02 10.02 0 007.02-3.34A9.15 9.15 0 0019.52 10a.75.75 0 000-.22C18.27 6.11 14.5 3 10 3zm0 12a7.99 7.99 0 01-5.73-2.43A7.11 7.11 0 012.98 10a7.11 7.11 0 011.29-2.57A7.99 7.99 0 0110 5a7.99 7.99 0 015.73 2.43A7.11 7.11 0 0117.02 10a7.11 7.11 0 01-1.29 2.57A7.99 7.99 0 0110 15z" />
                                            <path d="M10 7a3 3 0 100 6 3 3 0 000-6z" />
                                        </svg>
                                    ) : (
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M3.94 3.94a.75.75 0 011.06 0l12 12a.75.75 0 11-1.06 1.06l-12-12a.75.75 0 010-1.06zM14.5 10c0 2.21-1.79 4-4 4a3.97 3.97 0 01-2.82-1.18L8.7 10.8A1.98 1.98 0 0010 12c1.1 0 2-.9 2-2a1.98 1.98 0 00-.2-.81l1.52-1.52A3.97 3.97 0 0114.5 10zm-4-2c-1.1 0-2 .9-2 2a1.98 1.98 0 00.2.81l1.5-1.5A.98.98 0 0010 8zm4.64 3.19l-1.28-1.28A3.97 3.97 0 0110 14c-2.21 0-4-1.79-4-4 0-.5.09-.99.24-1.45l-.81-.81A7.11 7.11 0 002.98 10a7.11 7.11 0 001.29 2.57A7.99 7.99 0 0010 15a7.99 7.99 0 005.73-2.43c.52-.6.94-1.26 1.29-1.98z" clipRule="evenodd" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-start">
                                    <div className="flex items-center h-5">
                                        <input
                                            id="remember"
                                            aria-describedby="remember"
                                            type="checkbox"
                                            className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-orange-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-orange-600 dark:ring-offset-gray-800"
                                            required
                                        />
                                    </div>
                                    <div className="ml-3 text-sm">
                                        <label htmlFor="remember" className="text-gray-500 dark:text-gray-300">
                                            Remember me
                                        </label>
                                    </div>
                                </div>
                            </div>
                            <button
                                type="submit"
                                className="w-full text-white bg-orange-600 hover:bg-orange-700 focus:ring-4 focus:outline-none focus:ring-orange-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-orange-600 dark:hover:bg-orange-700 dark:focus:ring-orange-800"
                            >
                                Sign in
                            </button>
                            <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                                Don’t have an account yet?{' '}
                                <a href="/auth/signup" className="font-medium text-orange-600 hover:underline dark:text-orange-500">
                                    Sign up
                                </a>
                            </p>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    )
}
