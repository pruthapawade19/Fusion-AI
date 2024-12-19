"use client";
import { useState } from "react";
import { HiCheckCircle } from "react-icons/hi";
import { HiXCircle } from "react-icons/hi";
import { db } from "@/firebase/db";
import { ImSpinner3 } from "react-icons/im";
import toast from "react-hot-toast";
import { saveAs } from "file-saver";
import { Parser } from "json2csv";

export default function DisplayQuestions({ questions, setQuestions }) {
    const [quizName, setQuizName] = useState("");
    const [saving, setSaving] = useState(false);
    const [exportType, setExportType] = useState("CSV");

    const handleSave = async () => {
        setSaving(true);
        try {
            await db.collection("quizzes").add({
                name: quizName,
                questions,
            });
            setQuestions([]);
            setQuizName("");
            toast.success("Quiz saved successfully");
        } catch (error) {
            console.error("Error saving quiz:", error);
            toast.error("Failed to save quiz");
        } finally {
            setSaving(false);
        }
    };

    const handleExport = () => {
        switch (exportType) {
            case "CSV":
                exportToCSV();
                break;
            case "JSON":
                exportToJSON();
                break;
            default:
                break;
        }
    };

    const exportToCSV = () => {
        const fields = ["qno", "question", "options", "answer"];
        const parser = new Parser({ fields });
        const csv = parser.parse(questions);
        const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
        saveAs(blob, `${quizName}.csv`);
    };

    const exportToJSON = () => {
        const json = JSON.stringify(questions, null, 2);
        const blob = new Blob([json], { type: "application/json;charset=utf-8;" });
        saveAs(blob, `${quizName}.json`);
    };

    return (
        <div className="relative overflow-x-auto ">
            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                <caption className="p-5 text-xl font-semibold text-left rtl:text-right text-gray-900 bg-white dark:text-white dark:bg-gray-800">
                    Questions
                    <p className="mt-1 text-sm font-normal text-gray-500 dark:text-gray-400">
                        Here are the questions that will be displayed to the students.
                    </p>
                    <div className="flex items-center mt-2">
                        <input
                            type="text"
                            placeholder="Quiz Name"
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 me-2 mb-2"
                            value={quizName}
                            onChange={(e) => setQuizName(e.target.value)}
                        />
                        <button
                            type="button"
                            className="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
                            onClick={handleSave}
                        >
                            {saving ? <ImSpinner3 className="animate-spin" /> : "Save"}
                        </button>
                    </div>
                    {/* Export Section */}
                    <div className="flex items-center mt-2">
                        <select
                            id="exportType"
                            className="max-w-xs bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 me-2 mb-2"
                            value={exportType}
                            onChange={(e) => setExportType(e.target.value)}
                        >
                            <option value="CSV">CSV</option>
                            <option value="JSON">JSON</option>
                        </select>
                        <button
                            type="button"
                            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                            onClick={handleExport}
                        >
                            Export
                        </button>
                    </div>
                </caption>

                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                        <th scope="col" className="px-6 py-3 text-center">Question</th>
                        <th scope="col" className="px-6 py-3 text-center">Options</th>
                        <th scope="col" className="px-6 py-3 text-center">Actions</th>
                    </tr>
                </thead>

                <tbody>
                    {questions.map((question, index) => (
                        <tr key={index} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                            <th
                                scope="row"
                                className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white text-base text-wrap"
                            >
                                Q. {question.qno}. {question.question}
                            </th>
                            <td className="px-6 py-4">
                                <ul className="max-w-md space-y-1 text-gray-500 list-inside dark:text-gray-400">
                                    {question.options.map((option, idx) => (
                                        <li key={idx} className="flex items-center">
                                            {question.answer === option ? (
                                                <HiCheckCircle className="w-4 h-4 me-2 text-green-500 dark:text-green-400 flex-shrink-0" />
                                            ) : (
                                                <HiXCircle className="w-4 h-4 me-2 text-red-500 dark:text-red-400 flex-shrink-0" />
                                            )}
                                            {option}
                                        </li>
                                    ))}
                                </ul>
                            </td>
                            <td className="px-6 py-4 text-center">
                                <button
                                    type="button"
                                    className="px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                                >
                                    Edit
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
