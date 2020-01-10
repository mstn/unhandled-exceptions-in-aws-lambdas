const throwUnhandledException = async () => {
  const o = undefined;
  // throw TypeError
  o.someProperty;
  return 'ok';
}
  
const handler = async () => {
  try {
    const result = await throwUnhandledException();
    console.log('[FUN 3] Result %j', result);
    return {
      statusCode: 200,
      body: 'OK'
    };
  } catch (e) {
    console.log('[FUN 3] ERROR %j', e);
    return {
      statusCode: 500,
      body: JSON.stringify(e)
    };
  }
}

exports.handler = handler;
