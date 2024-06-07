import OpenAI from "openai";
import dotenv from "dotenv";
import express from "express";
import cors from "cors";

dotenv.config();
const app = express();

const openai = new OpenAI({
    apiKey: process.env.OPEN_AI_SECRET_KEY,
});

//Pass incoming json data

app.use(express.json());
const PORT = process.env.PORT || 9090;

const corsOptions = {
    origin: ['http://localhost:5173', 'http://localhost:5174']
}
app.use(cors(corsOptions));

//Varaible to maintain conversation history
let conversationHistory = [
    {role: "system", content: "You are a helpful assistant"},
];

//Routes
app.post('/ask', async (req, res) => {
    const userMessage = req.body.message;
    conversationHistory.push({role: "user", content: userMessage});

    try {
        const completion = await openai.chat.completions.create({
            messages: conversationHistory,
            model: "gpt-3.5-turbo",
        });
        //Extract reponse
        const reponse = completion.choices[0].message.content;
        // send response
        res.json({message: reponse});
    } catch (err) {
        res.status(500).send("Error generating response from Open AI")
    }
});

// Run the server
app.listen(PORT, console.log(`Server is running on port ${PORT}...`));