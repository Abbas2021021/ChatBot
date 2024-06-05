import OpenAI from "openai";
import dotenv from "dotenv";
import express from "express";

dotenv.config();

const openai = new OpenAI({
    apiKey: process.env.OPEN_AI_SECRET_KEY,
});

const PORT = process.env.PORT || 9090;
const app = express();

//Varaible to maintain conversation history
let conversationHistory = [
    {role: "system", content: "You are a helpful assistant"},
];

//Routes
app.post('/ask', async (req, res) => {
    const userMessage = req.body.message;
    conversationHistory.push({role: 'user', content: userMessage});

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
        res.status(500).send('Error generating response from Open AI')
    }
});

// Run the server
app.listen(PORT, console.log(`Server is running on port ${PORT}...`));