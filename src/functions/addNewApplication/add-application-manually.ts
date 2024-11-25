import { JobDetailsDTO } from './job-details.dto';

export class ManualJobDetailsExtractor {
  /**
   * Prompts the user to manually input job details.
   * @param link The URL of the job offer page.
   * @returns A JobDetailsDTO object with user-provided details.
   */
  async manuallyEnterJobDetails(link: string): Promise<JobDetailsDTO> {
    console.log("Please enter the following job details:");

    const companyName = await this.promptUser("Company Name");
    const description = await this.promptUser("Job Description");
    const datePosted = await this.promptUser("Posting Date (YYYY-MM-DD, optional)", true);
    const deadline = await this.promptUser("Application Deadline (YYYY-MM-DD, optional)", true);
    const city = await this.promptUser("City (optional)", true);
    const remoteInput = await this.promptUser("Is the job remote? (yes/no)", true);
    const remote = remoteInput?.toLowerCase() === 'yes';
    const skillsInput = await this.promptUser("Skills (comma-separated, optional)", true);
    const skills = skillsInput ? skillsInput.split(',').map(skill => skill.trim()) : undefined;

    return {
      companyName: companyName || "Unknown Company",
      description: description || "No description provided.",
      datePosted: datePosted || undefined,
      deadline: deadline || undefined,
      link,
      city: city || undefined,
      remote,
      skills,
    };
  }

  /**
   * Simulates a user input prompt.
   * @param question The prompt message to display to the user.
   * @param optional Whether the input is optional.
   * @returns The user's input or null if optional and skipped.
   */
  private async promptUser(question: string, optional = false): Promise<string | null> {
    const readline = await import('readline');
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    return new Promise(resolve => {
      rl.question(`${question}${optional ? ' (Press Enter to skip)' : ''}: `, answer => {
        rl.close();
        resolve(optional && !answer.trim() ? null : answer.trim());
      });
    });
  }
}
