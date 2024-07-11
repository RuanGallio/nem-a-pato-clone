import { defineEventHandler, readBody, H3Event } from 'h3'
import { openai, systemMessage } from "../openAI";


export default defineEventHandler(async (event: H3Event ) => {
  // Configure OpenAI with your API key

  const req = await readBody<{ difficulty: "easy"|"medium"|"hard", usedTopics: string[] }>(event)

  console.log('=== req getQuestion.ts [10] ===', req);
  const response = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [
      {
        role: 'system',
        content: systemMessage,
      },
      {
        role: 'user',
        content: `START ${req.difficulty}. Used topics: ${req.usedTopics.join(', ')}`,
      },
    ],
  });

  // the answer is like:
  // TOPIC: {topic}
  // QUESTION: {question}
  // ANSWER: {answer}
  // parse the string to get the question, topic and answer
  // return the question
  console.log('=== response getQuestion.ts [21] ===', response);
console.log('=== response.choices[0] getQuestion.ts [22] ===', response.choices[0].message.content);

  const content = response.choices[0].message.content?.split('\n').filter(Boolean);
  if (!content) {
    throw new Error('Invalid response from OpenAI');
  }
  console.log('=== content getQuestion.ts [37] ===', content);
  const topic = content[0].split(':')[1].trim();
  console.log('=== topic getQuestion.ts [34] ===', topic);
  console.log('=== content getQuestion.ts [39] ===', content);
  const question = content[1].split(':')[1].trim();
console.log('=== question getQuestion.ts [42] ===', question);
  const answer = content[2].split(':')[1].trim();
  console.log('=== answer getQuestion.ts [44] ===', answer);

  return {
      question,
      topic,
      answer
  };
});