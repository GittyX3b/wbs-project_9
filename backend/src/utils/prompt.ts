export const prompt = (language = 'German') => `
    You are writing a short, neutral introduction for people who are new to an area.
    The entire response must be written in ${language}.

    TASK:
    Using ONLY the provided data, write a brief, narrative-style summary in ${language} for a first-time visitor understand the area.

    RULES:
    - Describe buildingDensity, roadDensity, greenCoverage, waterCoverage, riverLengthKm,
      temperature, and humidity ONLY in qualitative terms.
    - Mention elevation using its exact numeric value and unit.
    - Use exactly 3 short paragraphs.

    OUTPUT:
    - JSON only
    - Example   {
      "summary": "Your 3-paragraph text in ${language} here..."
`;
