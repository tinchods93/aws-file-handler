import 'reflect-metadata';
import commandInput from 'rebased/handler/input/commandApi';
import commandOutput from 'rebased/handler/output/commandApi';
import { commandMapper } from 'rebased/handler';
import depsContainer from '../../depsContainer';
import UploadFileAction from '../../application/actions/uploadFileAction';

export const handler = async (command, context) => {
  // console.log('MARTIN_LOG=> uploadImage -> command', command);
  const action = depsContainer.resolve(UploadFileAction);

  const actionResponse = await commandMapper(
    { command, context },
    commandInput,
    action.execute,
    commandOutput
  );
  console.log('MARTIN_LOG=> uploadImage -> actionResponse', actionResponse);
  return actionResponse;
  // try {
  //   const body = JSON.parse(event.body);
  //   console.log('MARTIN_LOG=> uploadImage -> body', body);
  //   // const bodyBuffer = Buffer.from(body.file, 'base64');
  //   const result = await cloudinary.uploader.upload(body.file, {
  //     public_id: 'test-id-pepepe',
  //     transformation: [
  //       { width: 2000, height: 4000, crop: 'limit' },
  //       { quality: 'auto' },
  //       { fetch_format: 'auto' },
  //     ],
  //   });

  //   return {
  //     statusCode: 200,
  //     headers: {
  //       'Access-Control-Allow-Origin': '*', // Required for CORS support to work
  //       'Access-Control-Allow-Credentials': true, // Required for cookies, authorization headers with HTTPS
  //     },
  //     body: JSON.stringify({
  //       message: 'Image uploaded successfully',
  //       url: result.secure_url,
  //     }),
  //   };
  // } catch (error) {
  //   return {
  //     statusCode: 500,
  //     headers: {
  //       'Access-Control-Allow-Origin': '*', // Required for CORS support to work
  //       'Access-Control-Allow-Credentials': true, // Required for cookies, authorization headers with HTTPS
  //     },
  //     body: JSON.stringify({
  //       message: 'Failed to upload image',
  //       error: error.message,
  //     }),
  //   };
  // }
};
