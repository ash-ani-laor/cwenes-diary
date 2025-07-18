/*
 * src/utils/fileUtils.js
 * Утилиты для экспорта и импорта раскладов в формате .xrlo (JSON)
 * Изменения:
 * - Создан для реализации экспорта/импорта
 * - Исправлено имя файла экспорта (используется question, если title пустой)
 * - Добавлено сохранение returnCount
 */
const isDev = process.env.NODE_ENV === "development";

export const exportLayout = (divination) => {
  try {
    const data = JSON.stringify(divination, null, 2);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${divination.title || divination.question || "layout"}.xrlo`;
    a.click();
    URL.revokeObjectURL(url);
    if (isDev) console.log("Layout exported:", divination);
  } catch (error) {
    console.error("Error exporting layout:", error);
  }
};

export const importLayout = async (onImport) => {
  try {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".xrlo,application/json";
    input.onchange = async (event) => {
      const file = event.target.files[0];
      if (!file) return;
      const text = await file.text();
      const data = JSON.parse(text);
      onImport(data);
      if (isDev) console.log("Layout imported:", data);
    };
    input.click();
  } catch (error) {
    console.error("Error importing layout:", error);
  }
};
