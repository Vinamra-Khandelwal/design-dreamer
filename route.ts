import { NextResponse } from 'next/server';
import Replicate from 'replicate';

export async function POST(request: Request) {
  try {
    // 1. Get request data (in JSON format) from the client
    const req = await request.json();

    const image = req.image;
    const theme = req.theme;
    const room = req.room;
    const selectedColor = req.color || 'DefaultColor'; // Provide a default color if not provided
    const selectedWallTextures = req.wallTextures || 'Smooth'; // Provide a default wall texture if not provided
    const selectedFurniture = req.furniture;
    const selectedLighting = req.lighting || 'Natural Light';

    // 2. Initialize the replicate object with your Replicate API token
    const replicate = new Replicate({
      auth:  'r8_Vnq0XUTGKt5epj5Yt94JZXEFQ7hvIAF3YvcpB',  //'r8_Mq1vtQKjmNyg2NoW8w3UwUf64RiDT5p1g3gOq' //'r8_68b8sOCrfn75mBlghWyqYwkjYfKcw9S3kPuGh' '//r8_6eLmazWVjgaNwMQCcLg1VENU5e4Lqw11NXNjH'
    });

    // 3. Set the model that we're about to run
    const model =
      'jagilley/controlnet-hough:854e8727697a057c525cdb45ab037f64ecca770a1769cc52287c2e56472a247b';

    // 4. Set the image which is the image we uploaded from the client
    const input = {
      image,
      prompt: `${theme} ${room} ${selectedFurniture} placed in the room and  ${selectedWallTextures} walltexture ${selectedColor} and ${selectedLighting} lighting` ,
      a_prompt: `best quality, extremely detailed, , interior, cinematic photo, ultra-detailed, ultra-realistic, award-winning`,
      };

    // 5. Run the Replicate's model (to remove background) and get the output image
    const output = await replicate.run(model, { input });

    // 6. Check if the output is NULL then return an error back to the client
    if (!output) {
      console.log('Something went wrong');
      return NextResponse.json(
        { error: 'Something went wrong' },
        { status: 500 }
      );
    }

    // 7. Otherwise, show output in the console (server-side)
    //  and return the output back to the client
    console.log('Output', output);
    return NextResponse.json({ output }, { status: 201 });
  } catch (error) {
    console.error('Error processing image:', error);
    return NextResponse.json(
      { error: 'Error processing image' },
      { status: 500 }
    );
  }
}
