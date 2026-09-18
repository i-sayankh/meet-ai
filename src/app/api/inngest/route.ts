import { serve } from "inngest/next";

import { inngest } from "@/inngest/client";
import { chatAgentReply, meetingsProcessing } from "@/inngest/functions";

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [meetingsProcessing, chatAgentReply],
});
