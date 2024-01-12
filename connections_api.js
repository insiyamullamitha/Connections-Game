require("dotenv").config();
const API_KEY = process.env.OPENAI_API_KEY;

async function fetchData() {
  const options = {
    method: "POST",
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "user",
          content:
            "You have no idea how hard I've worked to try and connect to this API",
        },
      ],
      max_tokens: 25,
    }),
  };

  try {
    const response = await fetch(
      "https://api.openai.com/v1/chat/completions",
      options
    );
    const data = await response.json();
    const outputResponse = data.choices[0].message.content;
    console.log(outputResponse);
  } catch (error) {
    console.error(error);
  }
}

// Call the asynchronous function
fetchData();
