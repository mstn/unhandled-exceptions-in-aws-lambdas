const throwUnhandledException = async () => {
  throw new Error('User defined exception');
}
  
const handler = async () => {
  try {
    const result = await throwUnhandledException();
    console.log('result %j', result);
    return {
      statusCode: 200,
      body: 'OK'
    };
  } catch (e) {
    console.log('[FUN 5] ERROR %j', e);
    return {
      statusCode: 500,
      body: JSON.stringify(e)
    };
  }
}

exports.handler = handler;