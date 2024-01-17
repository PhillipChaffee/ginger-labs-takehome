import {Body, Controller, Delete, Get, Path, Post, Route, SuccessResponse} from "tsoa";
import {Job, mapJobs, redisId} from "./job";
import db from "../../services/db/client";
import Bull from "bull";
import {hoursAgo} from "../../utils/time";

@Route("jobs")
export class JobsController extends Controller {

  private dbClient = db();
  private jobQueue: Bull.Queue<Job> = new Bull("jobs");

  @SuccessResponse("200")
  @Get("{jobId}")
  public async getJob(
    @Path() jobId: number
  ): Promise<Job | void> {
    const job = await this.dbClient.job.findUnique({where: {id: jobId}});
    if (!job) {
      this.setStatus(404);
      return;
    }

    return mapJobs([job])[0];
  }

  @SuccessResponse("201", "Created")
  @Post()
  public async createJobs(
    @Body() requestBody: { urls: string[] }
  ): Promise<Job[]> {
    const duplicateJobs = await this.dbClient.job.findMany({
      where: {
        url: {in: requestBody.urls},
        createdAt: {gt: hoursAgo(1)}
      }
    });
    const duplicateUrls = new Set(duplicateJobs.map(dj => dj.url));
    const deduplicatedUrls = requestBody.urls.filter(url => !duplicateUrls.has(url));

    const dbJobs = await this.dbClient.$transaction(
      deduplicatedUrls.map((url) => this.dbClient.job.create({data: {url}})),
    );

    const jobs = mapJobs(dbJobs);

    for (const job of jobs) {
      await this.jobQueue.add(job, {jobId: redisId(job)});
    }

    this.setStatus(201);
    return jobs;
  }

  @SuccessResponse("204", "No Content")
  @Delete("{jobId}")
  public async deleteJob(
    @Path() jobId: number
  ): Promise<void> {
    const dbJob = await this.dbClient.job.findUnique({where: {id: jobId}});
    if (!dbJob) {
      this.setStatus(404);
      return;
    }

    const job = mapJobs([dbJob])[0];
    await this.jobQueue.removeJobs(redisId(job));
    await this.dbClient.result.delete({where: {jobId}});
    await this.dbClient.job.delete({where: {id: jobId}});

    this.setStatus(204);
    return;
  }
}