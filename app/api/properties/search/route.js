import connectDB from '@/config/database';
import Property from '@/models/Property';

export const dynamic = 'force-dynamic';

// GET /api/properties/search
// when I hit this route in the browser:
//'http://localhost:3000/api/properties/search?location=boston&propertyType=All'
export const GET = async (request) => {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const location = searchParams.get('location');
    const propertyType = searchParams.get('propertyType');

    // to get all fractions that a user types in the search bar
    const locationPattern = new RegExp(location, 'i');

    // match location pattern against database fields
    let query = {
      $or: [
        { name: locationPattern },
        { description: locationPattern },
        { 'location.street': locationPattern },
        { 'location.city': locationPattern },
        { 'location.state': locationPattern },
        { 'location.zipcode': locationPattern },
      ],
    };

    // Only check for property if its not 'All'
    if (propertyType && propertyType !== 'All') {
      const propertyTypePattern = new RegExp(propertyType, 'i');
      query.type = propertyTypePattern;
    }

    const properties = await Property.find(query);

    return new Response(JSON.stringify(properties), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.log(error);
    return new Response('Something went wrong', {
      status: 500,
    });
  }
};
