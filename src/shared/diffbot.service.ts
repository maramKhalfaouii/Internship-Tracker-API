import axios from 'axios';
import * as dotenv from 'dotenv';
import { JobDetailsDTO } from '../functions/addNewApplication/job-details.dto';

dotenv.config();

export class DiffbotService {

  /**
   * Fetch job details from Diffbot API for a given link.
   * @param link The job posting URL to analyze.
   * @returns Parsed job details including company name, posting date, deadline, etc.
   */
  async fetchJobDetails(link: string): Promise<any> {
    const apiUrl = `https://api.diffbot.com/v3/job`;
    try {
      const response = await axios.get(apiUrl, {
        params: {
          url: link,
          token: process.env.DIFFBOT_API_KEY, 
        },
      });
      console.log('Diffbot API response:', response.data);
      const data = response.data;

      if (!data.objects || data.objects.length === 0) {
        throw new Error('No job details found for the given URL.');
      }

      const jobData = data;

      // Extract relevant information
      const jobDetails: JobDetailsDTO = {
        companyName: jobData.objects?.[0]?.employer?.name || "Not specified", // Extract employer name
        postingDate: jobData.datePosted || "Not specified", // Extract posting date
        deadline: jobData.deadline || "Not specified", // Provide deadline if available
        link, // Use the passed job link
        description: jobData.objects?.[0]?.text || "Not specified", // Extract description from objects
        skills: jobData.objects?.[0]?.skills?.map(skill => skill.skill) || [], // Map skills to an array of strings
        city: jobData.objects?.[0]?.locations?.[0]?.city?.name || "Not specified", // Extract city from locations
        remote: jobData.objects?.[0]?.remote || "Not specified", // Extract remote work info
      };

      return jobDetails;
    } catch (error: any) {
        if (error.response) {
            console.error('Error fetching job details - Response:', error.response.data);
            console.error('Status Code:', error.response.status);
        } else if (error.request) {
            console.error('Error fetching job details - No response received:', error.request);
        } else {
            console.error('Error fetching job details - Unexpected:', error.message);
        }
        throw new Error('Failed to fetch job details.');
    }
  }
}
