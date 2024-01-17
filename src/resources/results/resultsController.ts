import {Controller, Get, Path, Route} from "tsoa";
import {Result} from "./result";
import db from "../../services/db/client";

@Route("results")
export class ResultsController extends Controller {

  private dbClient = db();

  @Get("{jobId}")
  public async getResult(
    @Path() jobId: number
  ): Promise<Result | void> {
    const result = (await this.dbClient.result.findUnique({where: {jobId}}));
    if (!result) {
      this.setStatus(404);
      return;
    }

    return result;
  }
}