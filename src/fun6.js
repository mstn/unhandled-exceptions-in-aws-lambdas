const throwUnhandledException = async () => {
  const o = undefined;
  // throw TypeError
  o.someProperty;
  return 'ok';
}

// from https://stackoverflow.com/a/51876360
function getErrorObject(data) {
  let dataToSend = data;

  if (data.hasOwnProperty('stack')) {
    dataToSend = JSON.parse(JSON.stringify(data, Object.getOwnPropertyNames(data)));
  }
  return dataToSend;
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
    console.log('[FUN 5] ERROR %j', getErrorObject(e));
    return {
      statusCode: 500,
      body: JSON.stringify(getErrorObject(e))
    };
  }
}

exports.handler = handler;