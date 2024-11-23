import { DiffbotService } from "./../../shared/diffbot.service";
import { ManualJobDetailsExtractor } from "./add-application-manually";
import { JobDetailsDTO } from "./job-details.dto";
import { HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";

interface AddApplicationRequest {
  link: string;
  applied: boolean;
}

export class JobApplicationService {
    // Method to handle job application logic
    static async addApplication(
      req: HttpRequest,
      context: InvocationContext
    ): Promise<HttpResponseInit> {
      context.log("Processing request to add a job application...");
  
      const body = (await req.json()) as AddApplicationRequest;
      const { link, applied } = body;
  
      if (!link) {
        return {
          status: 400,
          body: "Job link is required.",
        };
      }
  
      const diffbotService = new DiffbotService();
      const manualExtractor = new ManualJobDetailsExtractor();
  
      // Declare jobDetails to use across the function
      let jobDetails: JobDetailsDTO;
  
      try {
        // Fetch job details using Diffbot
        context.log("Trying to fetch job details using Diffbot...");
        const fetchedDetails = await diffbotService.fetchJobDetails(link);
  
        // Extract job details safely
        jobDetails = fetchedDetails;
  
        context.log("Job details fetched successfully from Diffbot:", jobDetails);
      } catch (error) {
        context.log(
          `Diffbot failed to fetch job details: ${error.message}. Falling back to manual entry.`
        );
  
        // Fall back to manual extraction if Diffbot fails
        jobDetails = await manualExtractor.manuallyEnterJobDetails(link);
      }
  
      return {
        status: 200,
        body: JSON.stringify({
          message: "Job application processed successfully.",
          jobDetails,
        }),
      };
    }
  }
  