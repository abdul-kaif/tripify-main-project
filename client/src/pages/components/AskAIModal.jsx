import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

const AskAIModal = ({
  isOpen,
  onClose,
  onAsk,
  reply,
  loading,
  defaultPrompt,
}) => {
  const { t } = useTranslation();
  const [prompt, setPrompt] = useState("");

  // Auto ask if default prompt exists
  useEffect(() => {
    if (defaultPrompt && isOpen) {
      onAsk(defaultPrompt);
    }
  }, [defaultPrompt, isOpen]);

  // Clear prompt after reply
  useEffect(() => {
    if (reply) {
      setPrompt("");
    }
  }, [reply]);

  if (!isOpen) return null;

  const handleAsk = () => {
    if (!prompt.trim()) return;
    onAsk(prompt.trim());
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm">
      <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow-2xl w-[90%] max-w-lg relative">

        <h2 className="text-2xl font-semibold mb-4 text-center text-zinc-800 dark:text-zinc-100">
          {t("askAiModalPage.title")}
        </h2>

        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder={t("askAiModalPage.placeholder.askAnything")}
          className="w-full h-32 p-3 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-white resize-none outline-none focus:ring-2 focus:ring-blue-500"
        />

        <div className="mt-5 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 dark:bg-zinc-700 text-zinc-800 dark:text-white rounded-lg hover:bg-gray-400 dark:hover:bg-zinc-600 transition"
          >
            {t("askAiModalPage.buttons.close")}
          </button>

          <button
            onClick={handleAsk}
            disabled={loading || prompt.trim() === ""}
            className="px-4 py-2 rounded-lg font-semibold bg-[#EB662B] text-white disabled:opacity-60"
          >
            {loading
              ? t("askAiModalPage.buttons.searching")
              : t("askAiModalPage.buttons.askAi")}
          </button>
        </div>

        <div className="mt-6 p-4 rounded-lg bg-zinc-100 dark:bg-zinc-800 max-h-64 overflow-y-auto">

          <p className="text-zinc-700 dark:text-white font-bold text-lg mb-3">
            {t("askAiModalPage.answerTitle")}
          </p>

          {loading ? (
            <p className="text-blue-500 animate-pulse">
              {t("askAiModalPage.generating")}
            </p>
          ) : reply ? (
            <p className="text-zinc-800 dark:text-zinc-100 whitespace-pre-line">
              {reply}
            </p>
          ) : (
            <p className="text-zinc-400 italic">
              {t("askAiModalPage.noAnswer")}
            </p>
          )}
        </div>

      </div>
    </div>
  );
};

export default AskAIModal;