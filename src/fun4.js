const throwUnhandledException = async () => {
  throw new Error('User defined exception');
}
  
const handler = async () => {
  try {
    await throwUnhandledException();
    return {
      statusCode: 200,
      body: 'OK'
    };
  } catch (e) {
    console.log('[FUN 4] ERROR %j', e);
    return {
      statusCode: 500,
      body: JSON.stringify(e)
    };
  }
}

exports.handler = handler;
