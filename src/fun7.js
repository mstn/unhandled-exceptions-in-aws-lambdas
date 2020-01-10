const throwTimeoutException = () => {
  return new Promise( resolve => {
    setTimeout(() => resolve('OK'), 5000);
  })
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
    const result = await throwTimeoutException();
    console.log('result %j', result);
    return {
      statusCode: 200,
      body: 'OK'
    };
  } catch (e) {
    console.log('[FUN 7] ERROR %j', getErrorObject(e));
    return {
      statusCode: 500,
      body: JSON.stringify(getErrorObject(e))
    };
  }
}

exports.handler = handler;