const express = require("express");
const expressApp = express();
expressApp.use(express.json());
const PORT = process.env.PORT || 3000;

const { dialogflow, BasicCard, Button } = require("actions-on-google");
const conversationHandler = dialogflow();

const { provideCore } = require("@yext/answers-core");
const { answersApiKey } = require("./config");
const core = provideCore({
  apiKey: answersApiKey,
  experienceKey: "dtc_demo",
  locale: "en",
  experienceVersion: "PRODUCTION",
});

expressApp.post("/fulfillment", conversationHandler);

conversationHandler.intent("Default Welcome Intent", (conv) => {
  conv.add("Hi, from my app");
});

conversationHandler.fallback(async (conv) => {
  conv.add(await getAnswer(conv));
});

const getAnswer = async (query) => {
  const searchResults = await core.universalSearch({ query });

  if (searchResults.directAnswer) {
    // If there is a Direct Answer, we will highlight value of the answer and also return the snippet it came from
    return new BasicCard({
      text: searchResults.directAnswer.snippet.value,
      title: searchResults.directAnswer.value,
    });
  } else if (searchResults.verticalResults[0].verticalKey === "faq") {
    // if the top result is a FAQ, we will return the answer as plain text
    return searchResults.verticalResults[0].results[0].rawData.answer;
  } else if (searchResults.verticalResults[0].verticalKey === "help_articles") {
    // if the top result is Help Article, we will provide the title and a link to the article
    return new BasicCard({
      text: searchResults.verticalResults[0].results[0].rawData.s_snippet,
      title: searchResults.verticalResults[0].results[0].name,
      buttons: new Button({
        title: "Link to Help Article",
        link: searchResults.verticalResults[0].results[0].link,
      }),
    });
  } else {
    return "Sorry! I do not have an answer for that!";
  }
};

expressApp.listen(PORT, () =>
  console.log(`Webhook server is listening, port ${PORT}`)
);
