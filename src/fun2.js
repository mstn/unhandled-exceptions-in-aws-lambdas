const throwUnhandledException = async () => {
  const o = undefined;
  // throw TypeError
  o.someProperty;
  return 'ok';
}
  
const handler = async () => {
  await throwUnhandledException();
  return {
    statusCode: 200,
    body: 'OK'
  };
}

exports.handler = handler;
