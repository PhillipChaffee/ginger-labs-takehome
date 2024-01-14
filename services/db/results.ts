import dbClient from "./client";
import {Result} from "../../routes/results/result";

export type ResultsDbService = {
  createResults(jobId: number, data: string[]): Promise<Result[]>;
  getResult(id: number): Promise<Result>;
  deleteResult(id: number): void;
};

let resultsDbService: ResultsDbService;

const service = (): ResultsDbService => {
  if (resultsDbService) {
    return resultsDbService;
  }

  const db = dbClient();

  return {
    async createResults(jobId: number, data: string[]): Promise<Result[]> {
      return await db.$transaction(
        data.map((d) => db.result.create({data: {jobId, json: d}})),
      );
    },
    async getResult(id: number): Promise<Result> {
      return (await db.result.findUniqueOrThrow({where: {id}}));
    },
    async deleteResult(id: number) {
      await db.result.delete({where: {id}});
    }
  }
}

export default service;