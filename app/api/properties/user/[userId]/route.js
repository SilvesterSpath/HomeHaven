import connectDB from '@/config/database';
import Property from '@/models/Property';

// GET /api/properties/user/:userId
export const GET = async (request, { params }) => {
  try {
    await connectDB();

    const userId = params.userId; // this is userId, because we called the folder 'userId'

    if (!userId) {
      return new Response('User Id is required', {
        status: 400,
      });
    }

    const properties = await Property.find({ owner: userId });

    return new Response(JSON.stringify(properties), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.log(error);
    return new Response(error.message || error.toString(), {
      status: 500,
    });
  }
};
