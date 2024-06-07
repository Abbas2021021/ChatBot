import { useMutation } from '@tanstack/react-query'
import React, { useState } from 'react'
import axios from 'axios'
import "./Chatbot.css"
import {IoSend} from 'react-icons/io5';
import {FaHourglass} from "react-icons/fa";




//funtion to make http request
const sendMessageAPI = async(message) => {
    const res = await axios.post("http://localhost:9090/ask", {message});
    return res.data;
};

const Chat = () => {
    const [message, setMessage] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const [conversations, setConversations] = useState([
        {role:"assistant", content: "Hello! How can I help you?"},
    ]);
    //Mutation logic
    const mutation = useMutation({
        mutationFn: sendMessageAPI,
        mutationKey:['chatbot'],
        onSuccess:(data) => {
            setIsTyping(false);
            setConversations((prevConversation) => [
                ...prevConversation,
                {role:"assistant", content: data.message},
            ]);
        },
    });

    //handle submit
    const handleSubmitMessage = () => {
        const currentMessage = message.trim();
        if (!currentMessage) {
            alert("Please enter a message");
            return;
        }
        setConversations((prevConversation) => [
            ...prevConversation,
            {role:"user", content: currentMessage},
        ]);
        setIsTyping(true);
        mutation.mutate(currentMessage);
        setMessage("");
    };
    console.log(mutation);

    return (
        <>
            <div className="header">
                <h1 className="title"> AI Chatbot</h1>
                <p className="description">
                    Enter your message in the input box below to chat
                </p>

                <div className="chat-container">
                    <div className="conversation">
                        {conversations.map((entry, index) => (
                            <div className={`message ${entry.role}`} key={index}>
                                <strong>
                                    {entry.role == "user" ? "You" : "AI"}
                                </strong>
                                {entry.content}
                            </div>
                        ))}
                        {isTyping && (
                            <div className="messsage assistant">
                                <h1>AI</h1>
                                <strong>
                                    AI is typing...
                                </strong>
                            </div>
                        )}
                    </div>
                    <div className="input-area">
                        <input 
                            type="text" 
                            placeholder="Enter message" 
                            value={message}
                            onChange={(e) => setMessage(e.target.value)} 
                            onInput={(e) => e.key === "Enter" && handleSubmitMessage}
                        />
                        <button onClick={handleSubmitMessage}>
                            {mutation?.isPending ? "Loading" : <IoSend/>}
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Chat