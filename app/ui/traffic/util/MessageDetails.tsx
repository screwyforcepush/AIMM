import React from "react";
import { NodeMessage } from "../../types";
import { ATTRIBUTES } from "./const";
import { useState, useEffect } from "react";
import { AiOutlineDown, AiOutlineUp, AiOutlineRight } from "react-icons/ai";

interface MessageDetailsProps {
  message: NodeMessage;
  setInspectThread: Function;
}

const getMetaFromMessage = (message: NodeMessage) => {
  let meta: {
    dataPoint: string;
    label: string;
    color: string;
    emoji: string;
  }[] = [];

  if (message.user_response?.assessment.sentiment) {
    const sentiment = message.user_response.assessment.sentiment;
    meta.push({
      dataPoint: "Sentiment",
      label: sentiment,
      color: ATTRIBUTES[sentiment].color,
      emoji: ATTRIBUTES[sentiment].emoji,
    });
  }
  if (message.user_response?.assessment.engagement) {
    const engagement = message.user_response.assessment.engagement;
    meta.push({
      dataPoint: "Engagement",
      label: engagement,
      color: ATTRIBUTES[engagement].color,
      emoji: ATTRIBUTES[engagement].emoji,
    });
  }
  if (message.assistant_message?.assessment.cognitive_load) {
    const cogLoad = message.assistant_message.assessment.cognitive_load;
    meta.push({
      dataPoint: "Cognitive Load",
      label: cogLoad,
      color: ATTRIBUTES[cogLoad].color,
      emoji: ATTRIBUTES[cogLoad].emoji,
    });
  }
  if (message.assistant_message?.assessment.progression_status) {
    const progression = message.assistant_message.assessment.progression_status;
    meta.push({
      dataPoint: "Progression",
      label: progression,
      color: ATTRIBUTES[progression].color,
      emoji: ATTRIBUTES[progression].emoji,
    });
  }
  return meta;
};

const MessageDetails = ({ message, setInspectThread }: MessageDetailsProps) => {
  const meta = getMetaFromMessage(message);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setIsOpen(false);
  }, [message]);
  return (
    <div className="message-details pb-5">
      <div
        className="parent font-semibold flex justify-between cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div>
          {meta.map((item, index) => (
            <span key={index}>{item.emoji}</span>
          ))}
          <span> {message.message_id}</span>
        </div>
        {isOpen ? <AiOutlineUp /> : <AiOutlineDown />}
      </div>
      <div
        className={`child transition-all duration-300 ${
          isOpen ? "max-h-screen" : "max-h-0 overflow-hidden"
        }`}
      >
        <div
          className="font-semibold flex justify-between cursor-pointer"
          onClick={() => setInspectThread(message.thread_id)}
        >
          <div>Thread: {message.thread_id}</div>
          <AiOutlineRight className="text-2xl"/>
        </div>
        {meta.map((item, index) => (
          <p key={index}>
            {item.dataPoint}: {item.label}
          </p>
        ))}
        <div className="pt-5">
          {message.user_prompt && (
            <div>User: {message.user_prompt.message}</div>
          )}
          {message.assistant_message && (
            <div className="font-semibold p-2">
              AI: {message.assistant_message.message}
            </div>
          )}
          {message.user_response && (
            <div>User: {message.user_response.message}</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessageDetails;
