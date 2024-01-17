export class Result {
  constructor(id: number, jobId: number) {
    this.id = id;
    this.jobId = jobId;
  }

  id: number;
  jobId: number;
  json?: string;
}