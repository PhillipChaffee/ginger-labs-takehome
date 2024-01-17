import {JobStatus} from "./jobStatus";

type dbJob = { id: number, url: string, status: string };
export const mapJobs = (jobs: dbJob[]) => jobs.map((job) => new Job(job.id, job.url, job.status as JobStatus));
export const redisId = (job: Job) => `${job.id}-${job.url}`

export class Job {
  constructor(id: number, url: string, status: JobStatus) {
    this.id = id;
    this.status = status;
    this.url = url;
  }


  id: number;
  status: JobStatus;
  url: string;
}