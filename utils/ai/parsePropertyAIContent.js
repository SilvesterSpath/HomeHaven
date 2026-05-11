export const parsePropertyAIContent = (content) => {
  if (typeof content !== 'string' || !content.trim()) {
    return null;
  }

  try {
    const parsed = JSON.parse(content);
    const title = typeof parsed?.title === 'string' ? parsed.title.trim() : '';
    const shortDescription =
      typeof parsed?.shortDescription === 'string'
        ? parsed.shortDescription.trim()
        : '';

    if (!title || !shortDescription) {
      return null;
    }

    return { title, shortDescription };
  } catch (error) {
    return null;
  }
};
