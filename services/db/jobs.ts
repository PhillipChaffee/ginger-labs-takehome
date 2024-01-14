import {Job} from "../../routes/jobs/job";
import dbClient from "./client";
import {Status} from "../../routes/jobs/status";

export type JobsDbService = {
  createJobs(urls: string[]): Promise<Job[]>;
  getJob(id: number): Promise<Job>;
  deleteJob(id: number): void;
};

let jobsDbService: JobsDbService;

const service = (): JobsDbService => {
  if (jobsDbService) {
    return jobsDbService;
  }

  const db = dbClient();

  type dbJob = { id: number, url: string, status: string };
  const mapJobs = (jobs: dbJob[]) => jobs.map((job) => new Job(job.id, job.url, job.status as Status));

  return {
    async createJobs(urls: string[]): Promise<Job[]> {
      const jobs = await db.$transaction(
        urls.map((url) => db.job.create({data: {url}})),
      );
      return mapJobs(jobs);
    },
    async getJob(id: number): Promise<Job> {
      const job = await db.job.findUniqueOrThrow({where: {id}});
      // TODO: Error handling
      return mapJobs([job])[0];
    },
    async deleteJob(id: number) {
      await db.job.delete({where: {id}});
    }
  }
}

export default service;