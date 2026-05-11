import connectDB from '@/config/database';
import Message from '@/models/Message';
import { getSessionUser } from '@/utils/getSessionUser';

// This is for deploying to Vercel
export const dynamic = 'force-dynamic';

// PUT /api/messages/:id
export const PUT = async (req, { params }, res) => {
  try {
    await connectDB();

    const { id } = params; // the id is the [id] in the folder name

    const sessionUser = await getSessionUser(req, res);
    const { userId } = sessionUser;

    if (!sessionUser || !sessionUser.user) {
      return new Response(
        JSON.stringify('You must be logged in to see your messages'), // because we not doing anything with the message
        { status: 401 }
      );
    }

    const message = await Message.findById(id);

    if (!message) return new Response('Message not found', { status: 404 });

    // Verify ownership
    if (message.recipient.toString() !== userId.toString()) {
      return new Response('You do not have permission to update this message', {
        status: 401,
      });
    }

    // Update message to read/undread depending on the current status
    message.read = !message.read;

    await message.save();

    return new Response(
      JSON.stringify({ message: 'Message updated successfully' }),
      {
        status: 200,
      }
    );
  } catch (error) {
    console.log(error);
    return new Response('Something went wrong', { status: 500 });
  }
};
