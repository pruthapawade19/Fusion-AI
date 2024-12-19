import { useState } from "react";
import { ImSpinner3 } from "react-icons/im";//icon

export default function ImageSumary() {
    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [summary, setSummary] = useState(""); // To store the summary from the API
    const [error, setError] = useState(null); // To handle API errors
    const [fileInput, setFileInput] = useState(null); // To store the actual file input

    // Handle image file selection
    const handleImageChange = (e) => {
        const file = e.target.files[0]; // Get the first file from input
        setFileInput(file); // Store the file for later use in the API call
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImage(reader.result); // Store the image data URL for preview
            };
            reader.readAsDataURL(file); // Read the file as a data URL
        }
    };

    // Handle submit and API call
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!fileInput) {
            setError("Please upload an image.");
            return;
        }

        setLoading(true);
        setError(null);
        setSummary(""); // Reset summary before new request

        // Prepare the file for the API request
        const formData = new FormData();
        formData.append("file", fileInput);

        try {
            // Call Flask API
            const response = await fetch("http://localhost:5000/summarize_image", {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                throw new Error("Failed to summarize the image.");
            }

            const data = await response.json();
            if (data.summary) {
                setSummary(data.summary);
            } else {
                setSummary("No summary returned from the API.");
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
            // Reset the file input so the user can select the same file again
            document.getElementById("dropzone-file").value = "";
            setFileInput(null); // Reset the file input state after submit
        }
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
            <h1 className="text-2xl font-semibold text-gray-800 dark:text-white">
                Image Summary
            </h1>
            <p className="mt-4 text-gray-600 dark:text-gray-300">
                Upload an image and get a summary of the image using the power
                of AI.
            </p>

            <div className="flex items-center justify-center w-full mt-4">
                <label
                    htmlFor="dropzone-file"
                    className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
                >
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        {image ? (
                            <img
                                src={image}
                                alt="Selected"
                                className="h-40 w-auto object-contain"
                            />
                        ) : (
                            <>
                                <svg
                                    className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
                                    aria-hidden="true"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 20 16"
                                >
                                    <path
                                        stroke="currentColor"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                                    />
                                </svg>
                                <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                                    <span className="font-semibold">Click to upload</span> or drag and drop
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                    SVG, PNG, JPG or GIF (MAX. 5MB)
                                </p>
                            </>
                        )}
                    </div>
                    <input
                        id="dropzone-file"
                        type="file"
                        className="hidden"
                        onChange={handleImageChange} // Capture file input changes
                        accept="image/png, image/jpeg, image/gif, image/svg+xml" // Accept only image files
                    />
                </label>
            </div>

            {error && <p className="text-red-500 mt-4">{error}</p>}

            <button
                type="button"
                className="text-white mt-4 bg-gradient-to-br from-pink-500 to-orange-400 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-pink-200 dark:focus:ring-pink-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 w-full"
                onClick={handleSubmit}
            >
                {loading ? (
                    <>
                        <ImSpinner3 className="animate-spin inline-block w-4 h-4 me-2 p-0 m-0" />
                        Summarizing...
                    </>
                ) : (
                    "Summarize Image"
                )}
            </button>

            {summary && (
                <div className="mt-4 bg-gray-100 dark:bg-gray-900 p-4 rounded-lg shadow">
                    <h2 className="text-xl font-semibold">Summary</h2>
                    <p className="mt-2 text-gray-700 dark:text-gray-300">{summary}</p>
                </div>
            )}
        </div>
    );
}
