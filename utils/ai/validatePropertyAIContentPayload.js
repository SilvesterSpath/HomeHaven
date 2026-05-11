const MAX_RAW_NOTES_LENGTH = 1200;
const MAX_AMENITIES = 30;

const normalizeAmenities = (amenities) => {
  if (amenities === undefined) {
    return [];
  }

  if (!Array.isArray(amenities)) {
    return null;
  }

  const cleaned = amenities
    .map((amenity) => (typeof amenity === 'string' ? amenity.trim() : ''))
    .filter(Boolean);

  if (cleaned.length > MAX_AMENITIES) {
    return null;
  }

  return cleaned;
};

export const validatePropertyAIContentPayload = (payload) => {
  if (!payload || typeof payload !== 'object') {
    return { error: 'Request body must be a valid JSON object' };
  }

  const { propertyType, location, beds, baths, amenities, rawNotes } = payload;
  const parsedAmenities = normalizeAmenities(amenities);

  if (!propertyType || typeof propertyType !== 'string' || !propertyType.trim()) {
    return { error: 'propertyType is required and must be a non-empty string' };
  }

  if (!location || typeof location !== 'string' || !location.trim()) {
    return { error: 'location is required and must be a non-empty string' };
  }

  if (!Number.isFinite(Number(beds)) || Number(beds) < 0) {
    return { error: 'beds is required and must be a number greater than or equal to 0' };
  }

  if (!Number.isFinite(Number(baths)) || Number(baths) < 0) {
    return { error: 'baths is required and must be a number greater than or equal to 0' };
  }

  if (parsedAmenities === null) {
    return {
      error: 'amenities must be an array of strings and cannot exceed 30 items',
    };
  }

  if (
    rawNotes !== undefined &&
    (typeof rawNotes !== 'string' || rawNotes.length > MAX_RAW_NOTES_LENGTH)
  ) {
    return {
      error: `rawNotes must be a string up to ${MAX_RAW_NOTES_LENGTH} characters`,
    };
  }

  return {
    value: {
      propertyType: propertyType.trim(),
      location: location.trim(),
      beds: Number(beds),
      baths: Number(baths),
      amenities: parsedAmenities,
      rawNotes: rawNotes?.trim() || '',
    },
  };
};
