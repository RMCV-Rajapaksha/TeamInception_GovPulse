async function getUrgencyScore(
  title,
  description,
  gs_division,
  ds_division,
  status_id,
  authority_id,
  category_id,
  image_urls
) {
  try {
    const apiKey = process.env.GOOGLE_API_KEY;

    if (!apiKey) {
      throw new Error("GOOGLE_API_KEY environment variable is not set");
    }

    const prompt = `Analyze the following government issue and provide an urgency score between 0.0 and 10.0 (single decimal precision only). Return only the numerical value.

Title: ${title || "Not provided"}
Description: ${description || "Not provided"}
GS Division: ${gs_division || "Not specified"}
DS Division: ${ds_division || "Not specified"}
Status ID: ${status_id || "Not specified"}
Authority ID: ${authority_id || "Not specified"}
Category ID: ${category_id || "Not specified"}
Image URLs: ${
      image_urls && image_urls.length > 0 ? image_urls.join(", ") : "None"
    }

Consider factors like:
- Public safety impact
- Time sensitivity
- Scope of affected population
- Infrastructure criticality
- Emergency nature

Return only a single decimal number between 0.0 and 10.0:`;

    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-goog-api-key": apiKey,
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt,
                },
              ],
            },
          ],
        }),
      }
    );

    if (!response.ok) {
      throw new Error(
        `Gemini API error: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();
    const generatedText = data.candidates[0].content.parts[0].text.trim();

    // Extract numerical value and ensure it's in the correct range
    const urgencyScore = parseFloat(generatedText);

    if (isNaN(urgencyScore) || urgencyScore < 0 || urgencyScore > 10) {
      console.warn(
        "Invalid urgency score from Gemini, using default value 5.0"
      );
      return 5.0;
    }

    // Round to single decimal precision
    return Math.round(urgencyScore * 10) / 10;
  } catch (error) {
    console.error("Error calling Gemini API for urgency score:", error);
    // Return default urgency score on error
    return 5.0;
  }
}

module.exports = {
  getUrgencyScore,
};
