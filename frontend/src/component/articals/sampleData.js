
import { v4 as uuidv4 } from "uuid";

const now = () => new Date().toLocaleString();

export const SAMPLE_ARTICLES = [
  {
    id: uuidv4(),
    topic: "javascript",
    subtopic: "strings",
    title: "JavaScript / Strings",
    summary: "String ek data type hota hai — jo text ko represent karta hai.",
    content: `**String** ek data type hota hai — jo text (characters) ko represent karta hai.
    
JavaScript me string ka matlab hota hai *quotes* ke andar likha hua text.

Example:
\`\`\`js
const name = "Abhishek";
const greeting = 'Hello, ' + name;
\`\`\`

**Note:** Strings immutable hote hain.`,
    createdAt: now(),
    updatedAt: now(),
  },
  {
    id: uuidv4(),
    topic: "javascript",
    subtopic: "array",
    title: "JavaScript / Arrays",
    summary: "Array ek ordered list hoti hai jisme multiple values store hoti hain.",
    content: `Arrays ordered collections hoti hain:

\`\`\`js
const arr = [1, 2, 3];
arr.push(4);
\`\`\``,
    createdAt: now(),
    updatedAt: now(),
  },
  {
    id: uuidv4(),
    topic: "reactjs",
    subtopic: "hooks",
    title: "React / Hooks",
    summary: "Hooks React ke functional components me state aur lifecycle allow karte hain.",
    content: `**useState** and **useEffect** bahut important hooks hain.

Example:
\`\`\`jsx
const [count, setCount] = useState(0);
useEffect(() => {
  document.title = count;
}, [count]);
\`\`\``,
    createdAt: now(),
    updatedAt: now(),
  },
];
