import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { JobApplicationService } from "./addNewApplication/service";

export async function addApplication(
    req: HttpRequest,
    context: InvocationContext
  ): Promise<HttpResponseInit> {
    return JobApplicationService.addApplication(req, context);
  }
  
  app.http("addApplication", {
    methods: ["POST"],
    authLevel: "anonymous",
    handler: addApplication,
  });
  
