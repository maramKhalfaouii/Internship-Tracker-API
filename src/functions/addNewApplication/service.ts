import { DiffbotService } from "./../../shared/diffbot.service";
import { ManualJobDetailsExtractor } from "./add-application-manually";
import { JobDetailsDTO } from "./job-details.dto";
import { HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { GoogleSheetsService } from '../../shared/GoogleSheetsService'; 

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
      const googleSheetsService = new GoogleSheetsService(); // Initialize the GoogleSheetsService
  
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
  
      // Save job details to Google Sheets
      try {
        context.log("Saving job details to Google Sheets...");
        await googleSheetsService.saveApplication({
          companyName: jobDetails.companyName || "Unknown",
          email: jobDetails.email || "N/A",
          deadline: jobDetails.deadline || "N/A",
          description: jobDetails.description || "N/A",
          link: link,
          skills: jobDetails.skills?.join(", ") || "N/A",
          city: jobDetails.city || "N/A",
          remote: jobDetails.remote ? "Yes" : "No",
        });
        context.log("Job details saved successfully to Google Sheets.");
      } catch (error) {
        context.log(`Failed to save job details to Google Sheets: ${error.message}`);
        return {
          status: 500,
          body: "Failed to save job details to Google Sheets.",
        };
      }
  
      return {
        status: 200,
        body: JSON.stringify({
          message: "Job application processed successfully and saved to Google Sheets.",
          jobDetails,
        }),
      };
    }
  }
