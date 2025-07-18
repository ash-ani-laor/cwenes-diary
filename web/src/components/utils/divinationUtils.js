/*
 * src/utils/divinationUtils.js
 * Утилиты для Годзаскинга
 * Изменения:
 * - Убрано лишнее логирование
 * - Добавлена проверка process.env.NODE_ENV
 * - Исправлена сортировка для режима П
 * - Добавлено логирование вопроса для отладки
 */
import { mysticalSeeder } from "./mysticalSeeder";

const isDev = process.env.NODE_ENV === "development";

export const newQuestion = () => {
  const questionNumber = Math.floor(Math.random() * 1708);
  return `Вопрос №${questionNumber}`;
};

export const sortOrShuffleSymbols = (
  symbols,
  question,
  isProtocolMode,
  isoDateTime = new Date().toISOString()
) => {
  if (!Array.isArray(symbols)) return [];

  let updatedSymbols;
  if (isProtocolMode) {
    updatedSymbols = [...symbols].sort((a, b) => a.id - b.id);
  } else {
    const seed = mysticalSeeder(question || newQuestion(), isoDateTime);
    updatedSymbols = [...symbols].sort(
      (a, b) => seed.indexOf(a.id) - seed.indexOf(b.id)
    );
  }

  updatedSymbols = updatedSymbols.map((symbol, index) => ({
    ...symbol,
    indexInJar: index,
  }));

  if (isDev)
    console.log(
      `sortOrShuffleSymbols (${isProtocolMode ? "Protocol" : "Divination"}):`,
      {
        question,
        symbolCount: updatedSymbols.length,
        firstFew: updatedSymbols.slice(0, 2).map((s) => ({
          id: s.id,
          symbol: s.symbol,
          indexInJar: s.indexInJar,
        })),
      }
    );

  return updatedSymbols;
};
