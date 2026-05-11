const apiDomain = process.env.NEXT_PUBLIC_API_DOMAIN || null;

// Fetch all properties
export async function fetchProperties() {
  try {
    // if domain is not awailable yet
    if (!apiDomain) {
      return [];
    }

    // this is on the server so I have to include full domain
    const response = await fetch(`${apiDomain}/properties`, {
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error('Something went wrong');
    }
    return response.json();
  } catch (error) {
    console.log(error);
    return [];
  }
}

// Fetch single property
export async function fetchProperty(id) {
  try {
    // if domain is not awailable yet
    if (!apiDomain) {
      return null;
    }

    // this is on the server so I have to include full domain
    const response = await fetch(`${apiDomain}/properties/${id}`);

    if (!response.ok) {
      throw new Error('Something went wrong');
    }

    return response.json();
  } catch (error) {
    console.log(error);
    return null;
  }
}

// Fetch all user property
export async function fetchUserProperties(userId) {
  try {
    // if domain is not awailable yet
    if (!apiDomain) {
      return [];
    }

    // this is on the server so I have to include full domain
    const response = await fetch(`${apiDomain}/properties/user/${userId}`, {
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error('Something went wrong');
    }
    return response.json();
  } catch (error) {
    console.log(error);
    return [];
  }
}

// Generate AI content for a property listing
export async function generateAIPropertyContent(payload) {
  const response = await fetch('/api/properties/ai-content', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.error?.message || 'Failed to generate AI content');
  }

  return data;
}

// Fetch search results
export async function fetchSearchResults(location, propertyType) {
  try {
    const res = await fetch(
      `/api/properties/search?location=${location}&propertyType=${propertyType}`
    );

    if (res.status === 200) {
      const data = await res.json();
      return data;
    } else {
      return [];
    }
  } catch (error) {
    console.log('error', error);
    return [];
  }
}
