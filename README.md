# Running locally

1. Create a `.env` file in the root dir with the following entry `DATABASE_URL="postgresql://postgres:ginger@localhost:54321/ginger?schema=public"`
2. `yarn`
3. Make sure you have docker and docker-compose installed and docker is running
4. `docker-compose up`
5. `npm run build`
6. `npm run dbinit`
7. `npm run dev`
8. Navigate to `http://localhost:3000/docs/`

# Description
Create a service containing a job queue. Each job will consist of fetching data from a URL and storing the results.

The service should expose REST or GraphQL API endpoints for:

    adding a new job (this should take the target URL as an argument)
    checking the status of an existing job
    retrieving the results of a completed job.
    deleting a job


If a URL has been submitted within the last hour, do not fetch the data again.

The API should also support batch requests for new jobs (i.e., you should be able to add jobs for several URLs at once).

# Todo

- [x] Endpoints
  - [x] adding a new job (this should take the target URL as an argument & support batch)
  - [x] checking the status of an existing job
  - [x] retrieving the results of a completed job.
  - [x] deleting a job
- [x] DB service
  - [x] createJob(urls)
  - [x] getJob(id)
  - [x] deleteJob(jobId)
  - [x] createResult(jobId, result)
  - [x] getResult(jobId, result)
  - [x] deleteResult(jobId, result)
- [x] Job Queue Service
  - [x] Define queue
  - [x] Define processor
  - [x] Add jobs to queue
- [x] Basic Error handling
- [x] Better route specific error handling / non success HTTP responses
- [x] Add how to run to readme

# Questions

- Who is going to be using this?
- How are they going to be using it?
- Does it matter what kind of data is at the end of the url / fetched?
  -No - you can assume the URL will return a response in JSON if it simplifies things.
- If a job is deleted, then the same url of the deleted job is added within an hour of the deleted job, should I process the URL? Basically, are deletes soft or hard? How tough do I need to protect against duplication of URLs within ther hour? 
  - Hard deletions are fine here.
- If the same url is added but it's been over an hour since last submission, do I fetch it again?
  - Yes.
- Is there any upper limit on how many times a single URL can be submitted/processed?
  - Nope
- What happens if a job is already running / in memory and is deleted?
- How many requests/second will this service get?
- Is this read or write oriented? Will more jobs be created or more resutls read?
- How accurate / up to date do reads need to be? Can I cache job reads? For how long?
- Should I cache result reads? Will that be helpful at all?
- Should I seperate job data from results data so they don't bottleneck eachother?
- How should the result data be structed? Will it all be the same type? Should I store it as JSON or normalize it bc it will all be the same type?

# Future Todos
- [ ] Check indexes
- [ ] Separate the job runner code from the service code, so they can scale independently
- [ ] Switch to GraphQL
- [ ] Check for stuck jobs
- [ ] Docker compose for spinning up local pg and redis
- [ ] Think about implementing application caching
- [ ] Add request validation library and invalid request error responses
- [ ] Messaging about duplicate urls that weren't added as jobs
