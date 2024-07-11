<template>
  <div>
    <button @click="getQuestion">Get Question</button>
    <button @click="getAnswer">Get Answer</button>
    <!-- make 3 radial buttons to choose difficulty -->
    <input
      @click="setDifficulty"
      type="radio"
      id="easy"
      name="difficulty"
      value="easy"
    />
    <label for="easy">Easy</label>
    <input
      @click="setDifficulty"
      type="radio"
      id="medium"
      name="difficulty"
      value="medium"
    />
    <label for="medium">Medium</label>
    <input
      @click="setDifficulty"
      type="radio"
      id="hard"
      name="difficulty"
      value="hard"
    />
    <label for="hard">Hard</label>
    <p>TóPICO: {{ topic }}</p>
    <p>QUESTÃO: {{ question }}</p>
    <p v-if="answered">RESPOSTA: {{ answer }}</p>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";

const answered = ref(false);
const question = ref("");
const answer = ref("");
const topic = ref("");
const difficulty = ref("medium");

const usedTopics = ref<string[]>([]);

const getAnswer = async () => {
  answered.value = true;
};

const setDifficulty = (event: Event) => {
  const target = event.target as HTMLInputElement;
  difficulty.value = target.value;
};

const getQuestion = async () => {
  answered.value = false;
  const body: { question: string; topic: string; answer: string } =
    await $fetch("/api/getQuestion", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: { difficulty: "hard", usedTopics: usedTopics.value },
    });
  console.log("=== data Question.vue [15] ===", body);

  question.value = body.question;
  answer.value = body.answer;
  topic.value = body.topic;
  usedTopics.value.push(body.topic);
};
</script>
