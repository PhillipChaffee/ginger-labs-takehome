import {Controller, Get, Path, Route} from "tsoa";
import {Result} from "./result";
import db from "../../services/db/client";
@Route("results")
export class ResultsController extends Controller {

  private dbClient = db();

  @Get("{jobId}")
  public async getResult(
    @Path() jobId: number
  ): Promise<Result> {
    return (await this.dbClient.result.findUniqueOrThrow({where: {jobId}}));
  }
}