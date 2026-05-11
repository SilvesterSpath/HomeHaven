export const buildPropertyAIContentPrompt = ({
  propertyType,
  location,
  beds,
  baths,
  amenities,
  rawNotes,
}) => {
  const amenitiesLine =
    amenities.length > 0 ? amenities.join(', ') : 'No specific amenities provided';

  const notesLine = rawNotes || 'No additional notes provided';

  return [
    'You are generating listing content for a rental property app.',
    'Return ONLY valid JSON with exactly these keys:',
    '{ "title": string, "shortDescription": string }',
    'Rules:',
    '- Do not include markdown, bullet points, or extra keys.',
    '- Keep title concise and natural for a listing.',
    '- Keep shortDescription to 2-3 short sentences.',
    '',
    `propertyType: ${propertyType}`,
    `location: ${location}`,
    `beds: ${beds}`,
    `baths: ${baths}`,
    `amenities: ${amenitiesLine}`,
    `rawNotes: ${notesLine}`,
  ].join('\n');
};
