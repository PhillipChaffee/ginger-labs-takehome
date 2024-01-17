import axios from "axios";
import db from "../../services/db/client";
import {Job} from "./job";
import Bull from "bull";

const register = (): void => {
  const jobQueue: Bull.Queue<Job> = new Bull("jobs");

  const dbClient = db();

  jobQueue.process(async (job: Bull.Job<Job>) => {
    // Mark job as in progress
    await dbClient.job.update({where: {id: job.data.id}, data: {status: "IN_PROGRESS"}})

    // Get data from job url
    const result = await axios.get(job.data.url);

    // Save data as a new result
    await dbClient.result.create({data: {jobId: job.data.id, json: JSON.stringify(result.data)}});

    // Mark job as completed
    await dbClient.job.update({where: {id: job.data.id}, data: {status: "COMPLETE"}});
  });
}

export default register;