# How to handle AWS Lambda errors

According to [4] an AWS Lambda can fail in three cases

1. Unhandled exception. For example, explicit uncaught `throw`, `TypeError` or `ReferenceError`.
2. Timeouts.
3. Out of memory.

## Retry on error

> "Depending on the event source, AWS Lambda might retry the failed Lambda function. For example, if Kinesis is the event source, AWS Lambda retries the failed invocation until the Lambda function succeeds or the records in the stream expire." [1]
* `Asynchronous invocation – Lambda retries function errors twice` [3]. 
* We should pay attention if some side effects are executed inside the lambda. Field `context.awsRequestId` [4] is what we are interested in if the lambda is not idempotent. More strategies in [4] (in memory data store, step functions).

## Unhandle exceptions

Good pratices

* `try-catch` in entrypoint lambda
* [How to read the thrown error](https://stackoverflow.com/a/51876360)

## How to log timeouts and out of memory

Timeout and out of memory errors are logged in Cloudwatch, but sometimes we want to make them more visible.

Timeout errors
* They cannot be captured with `try-catch`, but you can use `getRemainingTimeInMillis` as explained in [5].
* Even if that technique can generate false positive, I think it is valuable since timeouts are hard to observe.

Out of memory
* Some technique similar to [5] using `memoryLimitInMB` and nodejs`https://nodejs.org/api/process.html#process_process_memoryusage` should be fine.

## Scenarios

* we return `{ statusCode: number, body: string }` since it is what it is expected by API Gateway. Otherwise, we get `{"message": "Internal server error"}`. Other ways to invoke lambdas might require different return values.
* Runtime `nodejs12.x` (latest January 2020)

curl `/functions/1`

* `try-catch` everything/force `TypeError`
* Return `{}`
* CloudWatch `INFO ERROR {}`
* Lost info about error

curl `/functions/2`

* Don't `try-catch`/force `TypeError`
* Return `{"message": "Internal server error"}`
* CloudWatch ` ERROR Invoke Error {"errorType":"TypeError","errorMessage":"Cannot read property 'someProperty' of undefined"...`
* We get a clear description of the error

curl `/functions/3`

* `try-catch` everything/force `TypeError`
* Return `{}`
* CloudWatch `INFO ERROR {}`
* Lost info about error

curl `/functions/4`

* `try-catch` everything/explicit `throw`
* Return `{}`
* CloudWatch `INFO ERROR {}`
* Lost info about error

curl `/functions/5`

* `try-catch` everything/explicit `throw`
* Return `{}`
* CloudWatch `INFO ERROR {}`
* Lost info about error

curl `/functions/6`

* a global `try-catch` swallows error info
* Use [this trick](https://stackoverflow.com/a/51876360) to print or return error info

curl `/function/7`

* CloudWatch `Task timed out after 1.00 seconds`

## References

1. https://docs.aws.amazon.com/lambda/latest/dg/nodejs-prog-mode-exceptions.html
2. https://docs.aws.amazon.com/lambda/latest/dg/nodejs-prog-model-logging.html
3. https://docs.aws.amazon.com/lambda/latest/dg/retries-on-errors.html
4. https://epsagon.com/blog/how-to-handle-aws-lambda-errors-like-a-pro/
5. https://theburningmonk.com/2019/05/how-to-log-timed-out-lambda-invocations/