'use client'
import { useState } from "react";
import React, { useEffect, useRef } from 'react';
import { AiOutlineUser, AiOutlineRobot, AiOutlineSend } from "react-icons/ai";
import Markdown from 'react-markdown';
import Image from 'next/image';
import { Radar } from 'react-chartjs-2';
import 'chart.js/auto';

export default function OpenAIAssistant({
    assistantId,
    greeting = "I am a helpful chat assistant. How can I help you?",
    messageLimit = 10,
}) {
    const [isLoading, setIsLoading] = useState(false);
    const [threadId, setThreadId] = useState();
    const [prompt, setPrompt] = useState("");
    const [messages, setMessages] = useState([]);
    const [streamingMessage, setStreamingMessage] = useState({
        role: "assistant",
        content: "_Thinking..._",
    });

    // set default greeting Message
    const greetingMessage = {
        role: "assistant",
        content: greeting,
    };

    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        if (messages.length > 0) {
            messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        }
    }

    const inputRef = useRef();

    useEffect(() => {
        if (!isLoading) {
            inputRef.current.focus();
        }
    }, [isLoading]);

    useEffect(scrollToBottom, [messages, isLoading]);

    async function handleSubmit(e) {
        e.preventDefault();

        // clear streaming message
        setStreamingMessage({
            role: "assistant",
            content: "_Thinking..._",
        });

        // add busy indicator
        setIsLoading(true);

        // add user message to list of messages
        setMessages(
            [
                ...messages,
                {
                    id: "temp_user",
                    role: "user",
                    content: prompt,
                }
            ]
        );
        setPrompt("");

        // post new message to server and stream OpenAI Assistant response
        const response = await fetch('/api/openai-assistant', {
            method: 'POST',
            body: JSON.stringify({
                assistantId: assistantId,
                threadId: threadId,
                content: prompt,
            }),
        });

        let contentSnapshot = "";
        let newThreadId;

        // this code can be simplified when more browsers support async iteration
        // see https://developer.mozilla.org/en-US/docs/Web/API/Streams_API/Using_readable_streams#consuming_a_fetch_using_asynchronous_iteration
        let reader = response.body.getReader();
        while (true) {
            const { value, done } = await reader.read();

            if (done) {
                break;
            }

            // parse server sent event
            const strChunk = new TextDecoder().decode(value).trim();

            // split on newlines (to handle multiple JSON elements passed at once)
            const strServerEvents = strChunk.split("\n");

            // process each event
            for (const strServerEvent of strServerEvents) {
                try {
                    const serverEvent = JSON.parse(strServerEvent);

                    // console.log(serverEvent);
                    switch (serverEvent.event) {
                        // create new message
                        case "thread.message.created":
                            newThreadId = serverEvent.data.thread_id;
                            setThreadId(serverEvent.data.thread_id);
                            break;

                        // update streaming message content
                        case "thread.message.delta":
                            if (serverEvent.data.delta.content[0].text) {
                                contentSnapshot += serverEvent.data.delta.content[0].text.value;
                                const newStreamingMessage = {
                                    ...streamingMessage,
                                    content: contentSnapshot,
                                };
                                setStreamingMessage(newStreamingMessage);
                                scrollToBottom();
                            }
                            break;
                    }
                } catch (e) {
                    console.error("json parse error", e, strServerEvent);
                }
            }
        }

        // refetch all of the messages from the OpenAI Assistant thread
        const messagesResponse = await fetch("/api/openai-assistant?" + new URLSearchParams({
            threadId: newThreadId,
            messageLimit: messageLimit,
        }));
        const allMessages = await messagesResponse.json();
        setMessages(allMessages);

        // remove busy indicator
        setIsLoading(false);
    }

    // handles changes to the prompt input field
    function handlePromptChange(e) {
        setPrompt(e.target.value);
    }

    return (
        <div className="flex flex-col bg-slate-200 shadow-md relative rounded">
            {/* messages */}
            <div className="messages-container custom-max-height overflow-auto" >
                {/* Message rendering */}
                <OpenAIAssistantMessage message={greetingMessage} />
                {messages.map(m => (
                    <OpenAIAssistantMessage key={m.id} message={m} />
                ))}
                {isLoading && <OpenAIAssistantMessage message={streamingMessage} />}

                {/* Invisible element for automatic scrolling */}
                <div ref={messagesEndRef} />
            </div>
            <form onSubmit={handleSubmit} className="m-2 flex">
                <input
                    ref={inputRef}
                    disabled={isLoading}
                    className="border rounded-full w-full py-2 px-3 text-gray-700"
                    onChange={handlePromptChange}
                    value={prompt}
                    placeholder="Message Aimme"
                    aria-label="Send a message to Aimme" />
                {isLoading ?
                    <button
                        disabled
                        className="ml-2 bg-blue-500 text-white font-bold py-2 px-4 rounded-full focus:outline-none focus:shadow-outline">
                        <OpenAISpinner />
                    </button>
                    :
                    <button
                        disabled={prompt.length === 0}
                        className="ml-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full focus:outline-none focus:shadow-outline">
                        <AiOutlineSend />
                    </button>
                }
            </form>
        </div>
    )
}

function extractAndDelete(str) {
    const regex = /ASSESSMENT_RESULT={\[(\d+(?:,\d+)*)\],"([^"]*)"\}/;
    const match = str.match(regex);

    if (match) {
        // Extract the data
        const numbers = match[1].split(',').map(Number); // Convert string numbers to actual numbers
        const text = match[2];

        // Delete the pattern from the original string
        const updatedString = str.replace(regex, '');

        return {
            numbers,
            text,
            updatedString
        };
    } else {
        return null; // No match found
    }
}


function parseContent(content) {
    const result = extractAndDelete(content);
    if (result && result.numbers?.length == 6 && result.text && result.updatedString) {
        return (
            <div>
                <Markdown>
                    {result.updatedString}
                </Markdown>
                {RadarChart({ assessment_arr: result.numbers, business_name: result.text })}
                <p>🚀 Would you like some <strong>recommendations</strong> on how to step up your AI game? 🚀</p>
            </div>
        );
    }
    else return (
        <Markdown>
            {content}
        </Markdown>
    );
}

export function OpenAIAssistantMessage({ message }) {


    function displayRole(roleName) {
        switch (roleName) {
            case "user":
                return <AiOutlineUser />;
            case "assistant":
                return (
                    <div className="rounded-lg overflow-hidden">
                        <Image src={`/AIMM.jpeg`} width="256" height="256" alt="AIMM" />
                    </div>
                );
        }
    }


    const imageSize = message.content.includes("Aimme Pointsout") ? '20%' : '40px';

    // Inline style for dynamic width control
    const imageStyle = {
        width: imageSize,
        // Additional styles can be added here
    };

    return (
        <div className="flex rounded-lg text-gray-700 bg-white shadow-md m-2 p-4">
            <div style={imageStyle} className={`flex-none  text-4xl mr-5`}>
                {displayRole(message.role)}
            </div>
            <div className="flex-auto overflow-auto px-2">
                <div className="font-roboto text-gray-700" style={{ fontFamily: "'Roboto', sans-serif" }}>
                    {parseContent(message.content)}
                </div>
            </div>
        </div>

    )
}

// Based on https://flowbite.com/docs/components/spinner/
function OpenAISpinner() {
    return (
        <svg aria-hidden="true" role="status" className="inline w-4 h-4 text-white animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB" />
            <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor" />
        </svg>
    )
}

export function RadarChart({ assessment_arr, business_name }) {
    const data = {
        labels: ["Strategy and Vision", "Data Management", "Technology and Infrastructure",
            "People and Culture", "Governance and Ethics", "Performance and Scalability"],
        datasets: [{
            label: business_name + "'s AI Maturity Assessment",
            data: assessment_arr,
            fill: true,
            backgroundColor: 'rgba(0, 0, 255, 0.1)',
            borderColor: 'blue',
            pointBackgroundColor: 'blue',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'blue'
        }]
    };

    const options = {
        elements: {
            line: {
                borderWidth: 1.5
            }
        },
        scales: {
            r: {
                angleLines: {
                    display: true
                },
                suggestedMin: 0,
                suggestedMax: 5,
                ticks: {
                    stepSize: 1
                }
            }
        },
        plugins: {
            legend: {
                display: false
            },
            title: {
                display: true,
                text: business_name + "'s AI Maturity Assessment",
                font: {
                    size: 16
                }
            }
        }
    };

    return (
        <div className="p-4 bg-white rounded-lg shadow radar-chart">
            <Radar data={data} options={options} />
        </div>
    );
};

