import {NextRequest, NextResponse} from 'next/server'
import OpenAI from 'openai'
import { traceable } from "langsmith/traceable";
import { wrapOpenAI } from "langsmith/wrappers";

// this enables Edge Functions in Vercel
// see https://vercel.com/blog/gpt-3-app-next-js-vercel-edge-functions
// and updated here: https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config
export const runtime = "edge";


// post a new message and stream OpenAI Assistant response
const handler = traceable(async (request: NextRequest) => {
    const newMessage = await request.json();

    const openai = new OpenAI();

    if (!newMessage.threadId) {
        const thread = await openai.beta.threads.create({
            headers: {
                'OpenAI-Beta': 'assistants=v2'
            }
        });
        newMessage.threadId = thread.id;
    }

    await openai.beta.threads.messages.create(newMessage.threadId, {
        role: "user",
        content: newMessage.content
    }, {
        headers: {
            'OpenAI-Beta': 'assistants=v2'
        }
    });

    const run = await openai.beta.threads.runs.createAndStream(newMessage.threadId, {
        assistant_id: newMessage.assistantId,
        stream: true
    }, {
        headers: {
            'OpenAI-Beta': 'assistants=v2'
        }
    });

    const stream = run.toReadableStream();
    return new Response(stream);
});

export async function POST(request: NextRequest) {
    return handler(request);
}


// get all of the OpenAI Assistant messages associated with a thread
export const GET = async (request:NextRequest) => {
    // get thread id
    const searchParams = request.nextUrl.searchParams;
    const threadId = searchParams.get("threadId");
    const messageLimit = searchParams.get("messageLimit");

    if (threadId == null) {
        throw Error("Missing threadId");
    }

    if (messageLimit == null) {
        throw Error("Missing messageLimit");
    }

    // create OpenAI client
    const openai = new OpenAI();

    // get thread and messages
    const threadMessages = await openai.beta.threads.messages.list(
        threadId,
        {limit: parseInt(messageLimit)},
        {
            headers: {
                'OpenAI-Beta': 'assistants=v2'
            }
        }
    );

    // only transmit the data that we need
    const cleanMessages = threadMessages.data.map(m => {
        return {
            id: m.id,
            role: m.role,
            content: m.content[0].type == "text" ? m.content[0].text.value : "",
            createdAt: m.created_at,
        };
    });

    // reverse chronology
    cleanMessages.reverse();

    // return back to client
    return NextResponse.json(cleanMessages);
}
