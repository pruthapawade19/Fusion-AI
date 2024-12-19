"use client";
import { useState } from "react";
import { MdGeneratingTokens } from "react-icons/md";
import { FaFileAlt } from "react-icons/fa";
import { CgSpinner } from "react-icons/cg";
import { SiTableau } from "react-icons/si";
import DisplayQuestions from "./DisplayQuestions";
import { Toaster } from "react-hot-toast";

export default function GenerateQuestion() {
    const [topic, setTopic] = useState("");
    const [numberOfQuestions, setNumberOfQuestions] = useState(0);
    const [difficultyLevel, setDifficultyLevel] = useState("Easy");
    const [file, setFile] = useState(null); // If needed for the file upload option
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [questions, setQuestions] = useState([]);

    const [tab, setTab] = useState("prompt");
    const [topics, setTopics] = useState([
        { topicName: "", numberOfQuestions: "" },
    ]);

    // Function to handle adding a new topic
    const handleAddTopic = () => {
        setTopics([...topics, { topicName: "", numberOfQuestions: "" }]);
    };

    // Function to handle input changes for topic name and number of questions
    const handleInputChange = (index, field, value) => {
        const updatedTopics = topics.map((topic, i) =>
            i === index ? { ...topic, [field]: value } : topic
        );
        setTopics(updatedTopics);
    };

    const handleGenerateQuestions = async () => {
        setLoading(true);
        setError(null);

        try {
            if (tab === "multi-topic") {
                // Prepare the request payload
                const requestBody = {
                    topics: topics.map((topic) => ({
                        topicName: topic.topicName, // Topic name from each topic entry
                        numberOfQuestions: topic.numberOfQuestions, // Number of questions from each topic entry
                    })),
                    difficultyLevel, // Assuming difficultyLevel is available in your state
                };

                try {
                    const response = await fetch(
                        "http://localhost:5000/generate_question_topics",
                        {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify(requestBody),
                        }
                    );

                    if (!response.ok) {
                        throw new Error("Failed to generate questions.");
                    }

                    const data = await response.json();
                    setQuestions(data); // Assuming you have setQuestions in your state
                    return;
                } catch (error) {
                    console.error(error.message);
                }
            } else if (tab === "file") {
                const formData = new FormData();
                formData.append("file", file);
                formData.append("topic", topic);
                formData.append("no_of_questions", numberOfQuestions);
                formData.append("difficulty", difficultyLevel);

                const response = await fetch(
                    "http://localhost:5000/generate_question_by_file",
                    {
                        method: "POST",
                        body: formData, // No need for JSON.stringify, FormData handles this
                    }
                );

                if (!response.ok) {
                    throw new Error("Failed to generate questions.");
                }

                const data = await response.json();
                setQuestions(data);
                return;
            } else if (tab === "prompt") {
                const response = await fetch(
                    "http://localhost:5000/generate_question",
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            topic,
                            no_of_questions: numberOfQuestions,
                            difficulty: difficultyLevel,
                        }),
                    }
                );

                if (!response.ok) {
                    throw new Error("Failed to generate questions.");
                }

                const data = await response.json();
                console.log(data);
                setQuestions(data);
            }
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white dark:bg-gray-800 text-black dark:text-white p-4 rounded-lg">
            <h1 className="text-2xl font-bold mb-2">Generate Questions</h1>
            <p className="text-gray-500 mb-3">
                Generate questions based on the topic you provide or upload a
                file containing the syllabus or reference.
            </p>
            <Toaster />

            <div className="border-b border-gray-200 dark:border-gray-700 mb-4">
                <ul className="flex flex-wrap -mb-px text-sm font-medium text-center text-gray-500 dark:text-gray-400">
                    <li className="me-2">
                        <a
                            href="#"
                            className={`inline-flex items-center justify-center p-4 border-b-2 ${
                                tab === "prompt"
                                    ? "text-orange-600 border-orange-600 dark:text-orange-500 dark:border-orange-500"
                                    : "border-transparent hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300 "
                            } rounded-t-lg group`}
                            onClick={() => setTab("prompt")}
                        >
                            <MdGeneratingTokens
                                className={`w-5 h-5 me-2 ${
                                    tab === "prompt"
                                        ? "text-orange-600 dark:text-orange-500"
                                        : "text-gray-400 group-hover:text-gray-500 dark:text-gray-500 dark:group-hover:text-gray-300"
                                }`}
                            />
                            Using Prompt
                        </a>
                    </li>
                    <li className="me-2">
                        <a
                            href="#"
                            className={`inline-flex items-center justify-center p-4 border-b-2 ${
                                tab === "file"
                                    ? "text-orange-600 border-orange-600 dark:text-orange-500 dark:border-orange-500"
                                    : "border-transparent hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300 "
                            } rounded-t-lg group`}
                            aria-current="page"
                            onClick={() => setTab("file")}
                        >
                            <FaFileAlt
                                className={`w-5 h-5 me-2 ${
                                    tab === "file"
                                        ? "text-orange-600 dark:text-orange-500"
                                        : "text-gray-400 group-hover:text-gray-500 dark:text-gray-500 dark:group-hover:text-gray-300"
                                }`}
                            />
                            Using File
                        </a>
                    </li>
                    
                </ul>
            </div>

            {tab === "prompt" && (
                <div className="mb-3">
                    <label
                        htmlFor="message"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                        Topic
                    </label>
                    <textarea
                        id="message"
                        rows="4"
                        className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-orange-500 dark:focus:border-orange-500"
                        placeholder="Write the topic here on which you want to generate questions"
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                    ></textarea>
                </div>
            )}
            {tab === "file" && (
                <>
                    <div class="flex items-center justify-center w-full mb-3">
                        <label
                            for="dropzone-file"
                            class="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
                        >
                            <div class="flex flex-col items-center justify-center pt-5 pb-6">
                                <svg
                                    class="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
                                    aria-hidden="true"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 20 16"
                                >
                                    <path
                                        stroke="currentColor"
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        stroke-width="2"
                                        d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                                    />
                                </svg>
                                <p class="mb-2 text-sm text-gray-500 dark:text-gray-400">
                                    <span class="font-semibold">
                                        Click to upload
                                    </span>{" "}
                                    or drag and drop
                                </p>
                                <p class="text-xs text-gray-500 dark:text-gray-400">
                                    {file?.name ||
                                        "SVG, PNG, JPG or GIF (MAX. 800x400px)"}
                                </p>
                            </div>
                            <input
                                id="dropzone-file"
                                type="file"
                                class="hidden"
                                onChange={(e) => setFile(e.target.files[0])}
                            />
                        </label>
                    </div>

                    {/* Input prompt for file */}
                    <div className="mb-3">
                        <label
                            htmlFor="message"
                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                        >
                            Description
                        </label>
                        <textarea
                            id="message"
                            rows="4"
                            className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-orange-500 dark:focus:border-orange-500"
                            placeholder="Write the description here"
                            value={topic}
                            onChange={(e) => setTopic(e.target.value)}
                        ></textarea>
                    </div>
                </>
            )}

            {tab === "multi-topic" && (
                <div className="mb-3">
                    {topics.map((topic, index) => (
                        <div
                            key={index}
                            className="grid grid-cols-1 gap-6 md:grid-cols-2 mb-3"
                        >
                            <div>
                                <label
                                    htmlFor={`topic-input-${index}`}
                                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                >
                                    Topic Name
                                </label>
                                <input
                                    type="text"
                                    id={`topic-input-${index}`}
                                    aria-describedby="helper-text-explanation"
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-orange-500 focus:border-orange-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-orange-500 dark:focus:border-orange-500"
                                    placeholder="Enter Topic Name"
                                    value={topic.topicName}
                                    onChange={(e) =>
                                        handleInputChange(
                                            index,
                                            "topicName",
                                            e.target.value
                                        )
                                    }
                                    required
                                />
                            </div>
                            <div>
                                <label
                                    htmlFor={`number-input-${index}`}
                                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                >
                                    Select number of questions
                                </label>
                                <input
                                    type="number"
                                    id={`number-input-${index}`}
                                    aria-describedby="helper-text-explanation"
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-orange-500 focus:border-orange-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-orange-500 dark:focus:border-orange-500"
                                    placeholder="Enter number of questions"
                                    value={topic.numberOfQuestions}
                                    onChange={(e) =>
                                        handleInputChange(
                                            index,
                                            "numberOfQuestions",
                                            e.target.value
                                        )
                                    }
                                    required
                                />
                            </div>
                        </div>
                    ))}

                    <button
                        type="button"
                        onClick={handleAddTopic}
                        className="bg-orange-500 text-white px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                    >
                        Add Topic
                    </button>
                </div>
            )}

            <div
                className={
                    tab !== "multi-topic"
                        ? "grid grid-cols-1 gap-6 md:grid-cols-2"
                        : ""
                }
            >
                {tab !== "multi-topic" && (
                    <div className="mb-3">
                        <label
                            htmlFor="number-input"
                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                        >
                            Select number of questions
                        </label>
                        <input
                            type="number"
                            id="number-input"
                            aria-describedby="helper-text-explanation"
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-orange-500 focus:border-orange-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-orange-500 dark:focus:border-orange-500"
                            placeholder="Enter number of questions"
                            value={numberOfQuestions}
                            onChange={(e) =>
                                setNumberOfQuestions(e.target.value)
                            }
                            required
                        />
                    </div>
                )}

                <div className="mb-3">
                    <label
                        htmlFor="difficulty-level"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                        Select difficulty level
                    </label>
                    <select
                        id="difficulty-level"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-orange-500 focus:border-orange-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-orange-500 dark:focus:border-orange-500"
                        value={difficultyLevel}
                        onChange={(e) => setDifficultyLevel(e.target.value)}
                    >
                        <option value="Easy">Easy</option>
                        <option value="Medium">Medium</option>
                        <option value="Hard">Hard</option>
                    </select>
                </div>
            </div>

            <button
                type="button"
                className="text-white bg-gradient-to-br from-pink-500 to-orange-400 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-pink-200 dark:focus:ring-pink-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 w-full"
                onClick={handleGenerateQuestions}
                disabled={loading}
            >
                {loading ? (
                    <>
                        <CgSpinner className="animate-spin inline-block w-5 h-5 me-2" />
                        Generating Questions...
                    </>
                ) : (
                    "Generate Questions"
                )}
            </button>

            {/* Display Questions */}
            {error && <div className="text-red-500">{error}</div>}

            {questions.length > 0 && (
                <>
                    <hr className="mt-4 border-gray-200 dark:border-gray-700" />
                    <DisplayQuestions
                        questions={questions}
                        setQuestions={setQuestions}
                    />
                </>
            )}
        </div>
    );
}
