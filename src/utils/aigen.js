import { OpenAI } from "openai";

const openai = new OpenAI({ apiKey: process.env.REACT_APP_OPENAIKEY, dangerouslyAllowBrowser: true });

export const eventMake = async (message, objects) => {
  const today = new Date();

  const event = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { 
        role: "system", 
        content: 
          `You are helping a user manage a calendar with events.
          You might return a json object, which will be in this format:
          {
            title: "title of event",
            start: "start of event, which is a javascript date object. times start from 12am and end at 11pm"
            end: "end of event, which is a javascript date object on the same day as start, and time must be after start. should not go after 11pm",
            priority: "priority of event, either "Low", "Medium", "High", or "Urgent",
            id: "only for if the user wants to modify an existing object, then it will be an id from a list of given json objects. otherwise, set to null",
            location: "only if user gives a location. otherwise, set to null"
          }
          
          ONLY SEND A MESSAGE WITH THE JSON OBJECT AND NOTHING ELSE. DO NOT INCLUDE NEWLINES.
          For reference, today's date is ${today}.
          The user can do one of 3 things:
          When the user asks to create an event, return a json object with the new event. SET THE ID TO NULL IN THIS CASE.

          When the user asks to modify an event, return a json object with the modified parameters, and
          this time include the id of the json object to be modified (all json objects will be provided 2 lines after the message).

          When the user asks to delete an event, simply give me a json object with ONLY the id of the object to be removed.
          `
      },
      {
        role: "user",
        content: message + "\n\n" + objects,
      },
    ],
  });

  return event.choices[0].message.content;
};