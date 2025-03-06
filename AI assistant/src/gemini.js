const apiKey = import.meta.env.VITE_GEMINI_API_KEY || "AIzaSyD06BfNf2e0uDi2g0wyR1NQ0t-xD7-8cGs"; // Load API key from .env

if (!apiKey) {
    console.error("API key is missing! Check your .env file.");
}

async function generate(inputText) {
    const model = "gemini-2.0-flash";
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:streamGenerateContent?key=${apiKey}`;

    const requestBody = {
        contents: [{
            parts: [{
                text: inputText,
            }],
        }],
        generationConfig: {
            temperature: 1,
            topP: 0.95,
            topK: 40,
            maxOutputTokens: 512,
        },
    };

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(requestBody),
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error("API Error:", errorData);
            return "Error fetching response.";
        }

        const responseData = await response.json();
        console.log("Gemini API response:", responseData);

        // Extract and clean response
        const candidates = responseData.candidates || [];
        for (let candidate of candidates) {
            if (candidate.content?.parts?.length > 0) {
                const reply = cleanResponse(candidate.content.parts.map(part => part.text).join("\n"));
                speak(reply);
                return reply;
            }
        }
        
        return "Nova couldn't understand that. Please try again.";
    } catch (error) {
        console.error("Fetch Error:", error);
        return "Error processing request.";
    }
}

function cleanResponse(text) {
    return text
        .replace(/\n{2,}/g, "\n")  // Replace multiple newlines with a single newline
        .replace(/\s{2,}/g, " ")   // Replace multiple spaces with a single space
        .trim();                      // Trim extra spaces at the start & end
}

function speak(text) {
    const cleanedText = cleanResponse(text); // Clean before speaking
    const speech = new SpeechSynthesisUtterance(cleanedText);
    speech.lang = "en-US";
    speech.volume = 1;
    speech.rate = 0.9; // Slow down for better clarity
    speech.pitch = 1.1; // Slightly higher pitch for a natural tone
    window.speechSynthesis.speak(speech);
}

export default generate;