import { NextResponse, NextRequest } from "next/server";
import axios from "axios";


// Linear backoff function
function linearBackoff(attempt: number): number {
    return attempt * 500; // Delay increases by 500 ms per attempt
}



async function fetchWithLinearBackoff(url: string, retries: number = 5) {
    let attempt = 0;

    while (attempt < retries) {
        try {
            const response = await axios.get(url, {
                headers: {
                    "Content-Type": "application/json",
                },
            });
            return response; // Return the successful response
        } catch (error) {
            attempt++;
            if (attempt === retries) {
                // Throw an error or handle the failure after max retries
                throw new Error(`Failed to fetch after ${retries} attempts`);
            }

            // Get the linear backoff delay for the current attempt
            const delay = linearBackoff(attempt);
            console.log(`Attempt ${attempt} failed, retrying in ${delay / 1000} seconds...`);

            // Wait for the delay before retrying
            await new Promise((resolve) => setTimeout(resolve, delay));
        }
    }
}

export async function GET(
    req: NextRequest,
    context: any,
) {

    const page = parseInt(context.params.page, 10); // The current UI page
    const dogsPerPageUI = 15; // Number of dogs per UI page
    const dogsPerApiPage = 7; // Number of dogs per external API page
    const externalApiBaseUrl = `https://interview-wheat.vercel.app/api/dogs?page=`;

    // Calculate which external API pages to fetch based on UI page number
    const startApiPage = Math.floor((page - 1) * dogsPerPageUI / dogsPerApiPage) + 1;
    const endApiPage = Math.ceil(page * dogsPerPageUI / dogsPerApiPage);

    let dogs: any[] = [];

    try {
      // Fetch all the required pages from the external API
      for (let apiPage = startApiPage; apiPage <= endApiPage; apiPage++) {
          const url = `${externalApiBaseUrl}${apiPage}`;
          const res = await fetchWithLinearBackoff(url);

          if (res?.data) {
              dogs = dogs.concat(res.data); // Append dogs from each API page
          }
      }

      // Calculate the starting and ending index for slicing the combined dog list
      const startDogIndex = (page - 1) * dogsPerPageUI % dogsPerApiPage;
      const dogsForUIPage = dogs.slice(startDogIndex, startDogIndex + dogsPerPageUI);

      return NextResponse.json({ dogs: dogsForUIPage });
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 });
    }

}
