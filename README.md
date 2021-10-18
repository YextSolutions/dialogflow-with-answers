# dialogflow-with-answers
Demonstration of how to use Answers Core to power a Dialogflow Messenger experience.

This is a template for a webhook API for Google Dialogflow that utilizes Yext Answers Core. It has been designed to work with a specific Knowledge Graph configuration. To use this template:

1. Clone the repo
2. Add a ```.env``` file that includes an ```ANSWERS_API_KEY``` variable with the API key for your answers experience.
3. Modify the code in ```index.js``` to for your specific Answers experience.
4. Enter node index to run the endpoint on ```localhost:3000```
5. Expose your locally running endpoint publically using ngrok.
6. Create a Dialogflow Agent, enable a webhook call for the Default Fallback Intent, and add your public HTTPS URL as the Webhook URL.
7. Test using Dialogflow messenger.

Please see the Hitchhikers guide for more detailed instructions.
