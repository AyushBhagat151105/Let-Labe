import React from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Plus,
  Trash2,
  Code2,
  FileText,
  Lightbulb,
  BookOpen,
  CheckCircle2,
  Download,
} from "lucide-react";
import Editor from "@monaco-editor/react";
import { useState } from "react";
import { axiosInstance } from "../lib/axios";
import { toast } from "sonner";
import { createProblemSchema } from "@/validators/zod";
import { useNavigate } from "react-router-dom";
import { Info } from "lucide-react";
import { sampledpData, sampleStringProblem } from "@/lib/data";
import { Loader } from "lucide-react";

function CreateProblemForm() {
  const [sampleType, setSampleType] = useState("DP");
  const navigation = useNavigate();
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(createProblemSchema),
    defaultValues: {
      testcases: [{ input: "", output: "" }],
      tags: [""],
      examples: {
        JAVASCRIPT: { input: "", output: "", explanation: "" },
        PYTHON: { input: "", output: "", explanation: "" },
        JAVA: { input: "", output: "", explanation: "" },
      },
      codeSnippets: {
        JAVASCRIPT: "function solution() {\n  // Write your code here\n}",
        PYTHON: "def solution():\n    # Write your code here\n    pass",
        JAVA: "public class Solution {\n    public static void main(String[] args) {\n        // Write your code here\n    }\n}",
      },
      referenceSolutions: {
        JAVASCRIPT: "// Add your reference solution here",
        PYTHON: "# Add your reference solution here",
        JAVA: "// Add your reference solution here",
      },
    },
  });

  const {
    fields: testCaseFields,
    append: appendTestCase,
    remove: removeTestCase,
    replace: replacetestcases,
  } = useFieldArray({
    control,
    name: "testcases",
  });

  const {
    fields: tagFields,
    append: appendTag,
    remove: removeTag,
    replace: replaceTags,
  } = useFieldArray({
    control,
    name: "tags",
  });

  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (value) => {
    try {
      console.log(value);

      setIsLoading(true);
      const res = await axiosInstance.post("/problem/create-problem", value);
      console.log(res.data);
      toast(res.data.message || "Problem Created successfully⚡");
      navigation("/dashbord");
    } catch (error) {
      console.log(error);
      const errorMessage =
        error?.response?.data?.error ||
        "Something went wrong ❌(Problem already in DataBase)";
      toast(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const loadSampleData = () => {
    const sampleData = sampleType === "DP" ? sampledpData : sampleStringProblem;

    replaceTags(sampleData.tags.map((tag) => tag));
    replacetestcases(sampleData.testcases.map((tc) => tc));

    reset(sampleData);
  };

  return (
    <div className="container mx-auto py-10 px-4 max-w-6xl">
      <div className="bg-gray-800 rounded-xl shadow-xl border border-gray-700 overflow-hidden">
        <div className="bg-card p-6 md:p-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 pb-6 border-b border-gray-700">
            <h2 className="text-3xl font-bold flex items-center gap-3 text-white">
              <FileText className="w-8 h-8 text-primary" />
              Create Problem
            </h2>

            <div className="flex flex-col md:flex-row gap-4 mt-4 md:mt-0 w-full md:w-auto">
              <div className="shadow-sm gap-2.5 flex">
                <button
                  type="button"
                  className={`btn join-item flex items-center gap-1 transition-colors cursor-pointer px-3 py-2 rounded-2xl ${
                    sampleType === "DP"
                      ? "btn-active text-white bg-blue-600"
                      : "bg-gray-100 text-gray-700"
                  }`}
                  onClick={() => setSampleType("DP")}
                >
                  {sampleType === "DP"}
                  DP Problem
                </button>
                <button
                  type="button"
                  className={`btn join-item flex items-center gap-1 transition-colors cursor-pointer px-3 rounded-2xl ${
                    sampleType === "string"
                      ? "btn-active text-white bg-blue-600"
                      : "bg-gray-100 text-gray-700"
                  }`}
                  onClick={() => setSampleType("string")}
                >
                  {sampleType === "string"}
                  String Problem
                </button>
              </div>
              <button
                type="button"
                className="btn btn-secondary gap-2 shadow-sm cursor-pointer px-3 rounded-2xl flex items-center"
                onClick={loadSampleData}
              >
                <Download className="w-4 h-4" />
                Load Sample
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
            {/* Basic Information*/}
            <div className="bg-gray-900/30 rounded-xl p-6 shadow-sm border border-gray-700">
              <h3 className="text-xl font-semibold mb-6 flex items-center gap-2 text-gray-100">
                <Info className="w-5 h-5 text-primary" />
                Basic Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="form-control md:col-span-2">
                  <label className="label">
                    <span className="label-text text-base font-medium text-gray-300">
                      Title
                    </span>
                  </label>
                  <input
                    type="text"
                    className="input input-bordered w-full text-base p-3 bg-gray-800 focus:ring-2 focus:ring-primary/30 transition-all text-white px-3 rounded-2xl"
                    {...register("title")}
                    placeholder="Enter problem title"
                  />
                  {errors.title && (
                    <label className="label">
                      <span className="label-text-alt text-error text-red-500">
                        {errors.title.message}
                      </span>
                    </label>
                  )}
                </div>

                <div className="form-control md:col-span-2">
                  <label className="label">
                    <span className="label-text text-base font-medium text-gray-700 dark:text-gray-300">
                      Description
                    </span>
                  </label>
                  <textarea
                    className="textarea textarea-bordered min-h-40 w-full text-base p-4 resize-y bg-gray-800 focus:ring-2 focus:ring-primary/30 transition-all text-white px-3 rounded-2xl"
                    {...register("description")}
                    placeholder="Enter problem description"
                  />
                  {errors.description && (
                    <label className="label">
                      <span className="label-text-alt text-error text-red-500">
                        {errors.description.message}
                      </span>
                    </label>
                  )}
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text text-base font-medium text-gray-700 dark:text-gray-300 rounded-2xl">
                      Difficulty
                    </span>
                  </label>
                  <select
                    className="select select-bordered w-full text-base bg-gray-800 focus:ring-2 focus:ring-primary/30 transition-all text-white px-3 py-2 rounded-2xl"
                    {...register("difficulty")}
                  >
                    <option value="EASY">Easy</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HARD">Hard</option>
                  </select>
                  {errors.difficulty && (
                    <label className="label">
                      <span className="label-text-alt text-error text-red-500">
                        {errors.difficulty.message}
                      </span>
                    </label>
                  )}
                </div>
              </div>
            </div>

            {/* Tags */}
            <div className="bg-gray-900/30 rounded-xl p-6 shadow-sm border border-gray-700">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold flex items-center gap-2 text-gray-100">
                  <BookOpen className="w-5 h-5 text-primary" />
                  Tags
                </h3>
                <button
                  type="button"
                  className="btn btn-primary btn-sm shadow-sm cursor-pointer  rounded-2xl flex items-center"
                  onClick={() => appendTag("")}
                >
                  <Plus className="w-4 h-4 mr-1" /> Add Tag
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {tagFields.map((field, index) => (
                  <div
                    key={field.id}
                    className="flex gap-2 items-center bg-gray-800 rounded-lg p-1 pl-3 shadow-sm border border-gray-700"
                  >
                    <input
                      type="text"
                      className="flex-1 bg-transparent border-0 focus:ring-0 p-2 text-gray-300"
                      {...register(`tags.${index}`)}
                      placeholder="Enter tag"
                    />
                    <button
                      type="button"
                      className="btn btn-ghost btn-square btn-sm text-gray-500 hover:text-error group cursor-pointer"
                      onClick={() => removeTag(index)}
                      disabled={tagFields.length === 1}
                    >
                      <Trash2 className="w-4 h-4 text-gray-500 group-hover:text-red-500 transition-colors duration-200" />
                    </button>
                  </div>
                ))}
              </div>
              {errors.tags && (
                <div className="mt-2">
                  <span className="text-error text-sm text-red-500">
                    {errors.tags.message}
                  </span>
                </div>
              )}
            </div>

            {/* Test Cases  */}
            <div className="bg-gray-900/30 rounded-xl p-6 shadow-sm border border-gray-700">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold flex items-center gap-2 text-gray-100">
                  <CheckCircle2 className="w-5 h-5 text-primary" />
                  Test Cases
                </h3>
                <button
                  type="button"
                  className="btn btn-primary btn-sm shadow-sm flex items-center cursor-pointer"
                  onClick={() => appendTestCase({ input: "", output: "" })}
                >
                  <Plus className="w-4 h-4 mr-1" /> Add Test Case
                </button>
              </div>
              <div className="space-y-6">
                {testCaseFields.map((field, index) => (
                  <div
                    key={field.id}
                    className="bg-gray-800 rounded-lg shadow-sm border border-gray-700 overflow-hidden"
                  >
                    <div className="bg-gray-900/50 px-4 py-3 flex justify-between items-center">
                      <h4 className="text-base font-semibold text-gray-300">
                        Test Case #{index + 1}
                      </h4>
                      <button
                        type="button"
                        className="btn btn-ghost btn-sm text-error cursor-pointer flex items-center hover:text-red-500"
                        onClick={() => removeTestCase(index)}
                        disabled={testCaseFields.length === 1}
                      >
                        <Trash2 className="w-4 h-4 mr-1 " /> Remove
                      </button>
                    </div>
                    <div className="p-4 md:p-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="form-control">
                          <label className="label">
                            <span className="label-text text-gray-300 font-medium">
                              Input
                            </span>
                          </label>
                          <textarea
                            className="textarea textarea-bordered min-h-28 w-full p-3 resize-y bg-gray-900/30 focus:ring-2 focus:ring-primary/30 transition-all text-white"
                            {...register(`testcases.${index}.input`)}
                            placeholder="Enter test case input"
                          />
                          {errors.testcases?.[index]?.input && (
                            <label className="label">
                              <span className="label-text-alt text-error text-red-500">
                                {errors.testcases[index].input.message}
                              </span>
                            </label>
                          )}
                        </div>
                        <div className="form-control">
                          <label className="label">
                            <span className="label-text text-gray-300 font-medium">
                              Expected Output
                            </span>
                          </label>
                          <textarea
                            className="textarea textarea-bordered min-h-28 w-full p-3 resize-y bg-gray-900/30 focus:ring-2 focus:ring-primary/30 transition-all text-white"
                            {...register(`testcases.${index}.output`)}
                            placeholder="Enter expected output"
                          />
                          {errors.testcases?.[index]?.output && (
                            <label className="label">
                              <span className="label-text-alt text-error text-red-500">
                                {errors.testcases[index].output.message}
                              </span>
                            </label>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {errors.testcases && !Array.isArray(errors.testcases) && (
                <div className="mt-2">
                  <span className="text-error text-sm text-red-500">
                    {errors.testcases.message}
                  </span>
                </div>
              )}
            </div>

            <div className="space-y-10">
              {["JAVASCRIPT", "PYTHON", "JAVA"].map((language) => (
                <div
                  key={language}
                  className="bg-gray-900/30 rounded-xl p-6 shadow-sm border border-gray-700"
                >
                  <h3 className="text-xl font-semibold mb-6 flex items-center gap-2 text-gray-100">
                    <Code2 className="w-5 h-5 text-primary" />
                    {language === "JAVASCRIPT"
                      ? "JavaScript"
                      : language === "PYTHON"
                      ? "Python"
                      : "Java"}
                  </h3>

                  <div className="space-y-8">
                    {/* Starter Code */}
                    <div className="bg-gray-800 rounded-lg shadow-sm border border-gray-700 overflow-hidden">
                      <div className="bg-gray-900/50 px-4 py-3">
                        <h4 className="font-semibold text-base text-gray-300">
                          Starter Code Template
                        </h4>
                      </div>
                      <div className="p-0 overflow-hidden">
                        <Controller
                          name={`codeSnippets.${language}`}
                          control={control}
                          render={({ field }) => (
                            <Editor
                              height="300px"
                              language={language.toLowerCase()}
                              theme="vs-dark"
                              value={field.value}
                              onChange={field.onChange}
                              options={{
                                minimap: { enabled: false },
                                fontSize: 14,
                                lineNumbers: "on",
                                roundedSelection: false,
                                scrollBeyondLastLine: false,
                                automaticLayout: true,
                              }}
                            />
                          )}
                        />
                      </div>
                      {errors.codeSnippets?.[language] && (
                        <div className="p-3">
                          <span className="text-error text-sm text-red-500">
                            {errors.codeSnippets[language].message}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Reference Solution */}
                    <div className="bg-gray-800 rounded-lg shadow-sm border border-gray-700 overflow-hidden">
                      <div className="bg-gray-900/50 px-4 py-3 flex items-center gap-2">
                        <h4 className="font-semibold text-base text-gray-300">
                          Reference Solution
                        </h4>
                        <span className="badge badge-success text-xs font-normal">
                          Required
                        </span>
                      </div>
                      <div className="p-0 overflow-hidden">
                        <Controller
                          name={`referenceSolutions.${language}`}
                          control={control}
                          render={({ field }) => (
                            <Editor
                              height="300px"
                              language={language.toLowerCase()}
                              theme="vs-dark"
                              value={field.value}
                              onChange={field.onChange}
                              options={{
                                minimap: { enabled: false },
                                fontSize: 14,
                                lineNumbers: "on",
                                roundedSelection: false,
                                scrollBeyondLastLine: false,
                                automaticLayout: true,
                              }}
                            />
                          )}
                        />
                      </div>
                      {errors.referenceSolutions?.[language] && (
                        <div className="p-3">
                          <span className="text-error text-sm text-red-500">
                            {errors.referenceSolutions[language].message}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Examples */}
                    <div className="bg-gray-800 rounded-lg shadow-sm border border-gray-700 overflow-hidden">
                      <div className="bg-gray-900/50 px-4 py-3">
                        <h4 className="font-semibold text-base text-gray-300">
                          Example
                        </h4>
                      </div>
                      <div className="p-4 md:p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="form-control">
                            <label className="label">
                              <span className="label-text text-gray-300 font-medium">
                                Input
                              </span>
                            </label>
                            <textarea
                              className="textarea textarea-bordered min-h-24 w-full p-3 resize-y bg-gray-900/30 focus:ring-2 focus:ring-primary/30 transition-all text-white"
                              {...register(`examples.${language}.input`)}
                              placeholder="Example input"
                            />
                            {errors.examples?.[language]?.input && (
                              <label className="label">
                                <span className="label-text-alt text-error text-red-500">
                                  {errors.examples[language].input.message}
                                </span>
                              </label>
                            )}
                          </div>
                          <div className="form-control">
                            <label className="label">
                              <span className="label-text text-gray-300 font-medium">
                                Output
                              </span>
                            </label>
                            <textarea
                              className="textarea textarea-bordered min-h-24 w-full p-3 resize-y bg-gray-900/30 focus:ring-2 focus:ring-primary/30 transition-all text-white"
                              {...register(`examples.${language}.output`)}
                              placeholder="Example output"
                            />
                            {errors.examples?.[language]?.output && (
                              <label className="label">
                                <span className="label-text-alt text-error text-red-500">
                                  {errors.examples[language].output.message}
                                </span>
                              </label>
                            )}
                          </div>
                          <div className="form-control md:col-span-2">
                            <label className="label">
                              <span className="label-text text-gray-300 font-medium">
                                Explanation
                              </span>
                            </label>
                            <textarea
                              className="textarea textarea-bordered min-h-28 w-full p-3 resize-y bg-gray-900/30 focus:ring-2 focus:ring-primary/30 transition-all text-white"
                              {...register(`examples.${language}.explanation`)}
                              placeholder="Explain the example"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-gray-900/30 rounded-xl p-6 shadow-sm border border-gray-700">
              <h3 className="text-xl font-semibold mb-6 flex items-center gap-2 text-gray-100">
                <Lightbulb className="w-5 h-5 text-amber-500" />
                Additional Information
              </h3>
              <div className="space-y-6">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text text-gray-300 font-medium flex items-center gap-2">
                      Constraints
                      <span className="badge badge-primary text-xs font-normal">
                        Required
                      </span>
                    </span>
                  </label>
                  <textarea
                    className="textarea textarea-bordered min-h-28 w-full p-3 resize-y bg-gray-800 focus:ring-2 focus:ring-primary/30 transition-all text-white"
                    {...register("constraints")}
                    placeholder="Enter problem constraints"
                  />
                  {errors.constraints && (
                    <label className="label">
                      <span className="label-text-alt text-error text-red-500">
                        {errors.constraints.message}
                      </span>
                    </label>
                  )}
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text text-gray-300 font-medium flex items-center gap-2">
                      Hints
                      <span className="badge badge-secondary text-xs font-normal">
                        Optional
                      </span>
                    </span>
                  </label>
                  <textarea
                    className="textarea textarea-bordered min-h-28 w-full p-3 resize-y bg-gray-800 focus:ring-2 focus:ring-primary/30 transition-all text-white"
                    {...register("hints")}
                    placeholder="Enter hints for solving the problem"
                  />
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text text-gray-300 font-medium flex items-center gap-2">
                      Editorial
                      <span className="badge badge-secondary text-xs font-normal">
                        Optional
                      </span>
                    </span>
                  </label>
                  <textarea
                    className="textarea textarea-bordered min-h-36 w-full p-3 resize-y bg-gray-800 focus:ring-2 focus:ring-primary/30 transition-all text-white"
                    {...register("editorial")}
                    placeholder="Enter problem editorial/solution explanation"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center pt-6 border-t border-gray-700">
              <button
                type="submit"
                className="btn btn-primary btn-lg gap-2 flex items-center cursor-pointer p-3 bg-blue-500 rounded-2xl"
              >
                {isLoading ? (
                  <span className="loading loading-spinner text-white">
                    <Loader className="animate-spin" size={48} />
                  </span>
                ) : (
                  <>
                    <CheckCircle2 className="w-5 h-5" />
                    Create Problem
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CreateProblemForm;
