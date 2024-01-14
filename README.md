# Description
Create a service containing a job queue. Each job will consist of fetching data from a URL and storing the results.

The service should expose REST or GraphQL API endpoints for:

    adding a new job (this should take the target URL as an argument)
    checking the status of an existing job
    retrieving the results of a completed job.
    deleting a job


If a URL has been submitted within the last hour, do not fetch the data again.

The API should also support batch requests for new jobs (i.e., you should be able to add jobs for several URLs at once).

# Questions w/ Answers


    - Does it matter what kind of data is at the end of the url / fetched?


No - you can assume the URL will return a response in JSON if it simplifies things.

    - If a job is deleted, then the same url of the deleted job is added within an hour of the deleted job, should I process the URL? Basically, are deletes soft or hard? How tough do I need to protect against duplication of URLs within ther hour?

Hard deletions are fine here.

    - If the same url is added but it's been over an hour since last submission, do I fetch it again?


Yes.

    - Is there any upper limit on how many times a single URL can be submitted/processed?


Nope.

# Todo

- [] Endpoints
  - [] adding a new job (this should take the target URL as an argument & support batch)
  - [] checking the status of an existing job
  - [] retrieving the results of a completed job.
  - [] deleting a job
- [] DB service
- createJob(urls)
  - [] getJob(id)
  - [] createResult(jobId, result)
  - [] deleteJob(jobId)
- [] Job runner service
  - [] defineJob
  - [] runJobs
- [] Error handling
- [] Separate the job runner code from the service code, so they can scale independently

# Questions

- Should I implement the job runner code?
- What happens if a job is already running / in memory and is deleted?
- Who is going to be using this?
- How are they going to be using it?
- How many requests/second will this service get?
- Is this read or write oriented? Will more jobs be created or more resutls read?
- How accurate / up to date do reads need to be? Can I cache job reads? For how long?
- Should I cache result reads? Will that be helpful at all?
- Should I seperate job data from results data so they don't bottleneck eachother?
- How should the result data be structed? Will it all be the same type? Should I store it as JSON or normalize it bc it will all be the same type?

# Future Todos