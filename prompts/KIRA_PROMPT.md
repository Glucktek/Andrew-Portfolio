You are an AI developer tool. Your task is to generate a chatbot named **Kira** for integration into Andrew Gluck’s portfolio site (https://andrew-gluck.com).

### Constraints

- Kira must ONLY answer questions about Andrew’s **projects, blog posts, and resume**.
- Kira must NOT reference or use data from ABOUT.md, AGENTS.md, or any other sources.
- If a user asks something outside those topics, politely refuse. Example:  
  “I can only answer questions about Andrew’s projects, blog, or resume.”
- Kira should never provide outside web search or general knowledge.
- Kira must be implemented as a **React component inside an Astro project**.
- Must support **server-side rendering** (SSR) in Astro.
- The frontend will display Kira’s chat UI.
- The backend for handling LLM calls must also be implemented inside the Astro project, using an `/api/chat` route.
- The backend must include placeholder environment variable support for the **OpenRouter API key** (provided later).

### Initial Interaction

When the chatbot loads, Kira asks:  
“Welcome to Andrew's Portfolio, I am his AI assistant Kira. What questions can I answer for you about his projects, blog posts, or work history? I can also do things like summarize his resume for you.”

### Development Phases

#### Phase 1: UI Skeleton

- Build a minimal conversational chat interface as a React component.
- Include a welcome message and an input box for user queries.
- Use Tailwind for styling (minimal, responsive).

#### Phase 2: Astro SSR Integration

- Render the React chatbot component within an Astro page using server-side rendering.
- Ensure hydration is correctly configured (Astro + React).

#### Phase 3: Backend API Route

- Implement a backend route at `src/pages/api/chat.ts`.
- The route will:
  - Accept `POST` requests with the user’s message + conversation history.
  - Verify that the incoming question is scoped only to **projects, blog, or resume**.
  - Forward valid requests to OpenRouter’s API using a `fetch` call.
  - Return the model’s response back to the React component.
- Use `process.env.OPENROUTER_API_KEY` for authentication.
- IMPORTANT: Provide clear placeholder handling so Andrew can insert his key securely.

#### Phase 4: Response Handling

- Display user’s message and Kira’s response in chat bubbles.
- If the query is outside the allowed scope, Kira responds with a polite refusal.

#### Phase 5: Enhancements

- Store conversation history so multiple questions can be asked.
- Add quick-start prompt buttons:
  - "Summarize Andrew’s resume"
  - "List Andrew’s projects"
  - "Summarize Andrew’s latest blog post"

### Deliverables

- A single React component (`KiraChat.tsx`) for the chatbot UI.
- An Astro page that renders the component server-side.
- A backend API route file (`src/pages/api/chat.ts`) to securely connect to OpenRouter using environment variables.
