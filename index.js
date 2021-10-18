const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

const dfff = require('dialogflow-fulfillment');

const { provideCore } = require('@yext/answers-core');
const { answersApiKey } = require('./config');

const core = provideCore({
	apiKey: answersApiKey,
	experienceKey: 'dtc_demo',
	locale: 'en',
	experienceVersion: 'PRODUCTION'
});

app.use(express.json())

app.post('/api/webhook', (req, res) => {
	const query = req.body.queryResult.queryText

	const agent = new dfff.WebhookClient({ request: req, response: res});
	const intentMap = new Map()
  const options = {sendAsMessage: true, rawPayload: true}
		
	core.universalSearch({ query })
		.then(results => {
			let answer = () => {}
			if(results.directAnswer){ // If there is a Direct Answer, we will highlight value of the answer and also return the snippet it came from
				
        answer = () => {
					const payloadData = {
					  richContent: [
              [
                {
                  type: 'info',
                    title: results.directAnswer.value,
                    subtitle: results.directAnswer.snippet.value
                  }
              ]
            ]
				  }
				  agent.add(new dfff.Payload('PLATFORM_UNSPECIFIED', payloadData, options))
				}

		} else if(results.verticalResults[0].verticalKey === 'faq') { // if the top result is a FAQ, we will return the answer as plain text
			  
      answer = () => agent.add(results.verticalResults[0].results[0].rawData.answer)
			
    } else if(results.verticalResults[0].verticalKey === 'help_articles'){ // if the top result is Help Article, we will provide the title and a link to the article

          answer = () => {
            const payloadData = {
              richContent: [
                [
                  {
                    type: 'info',
                    title: results.verticalResults[0].results[0].name,
                    subtitle: results.verticalResults[0].results[0].rawData.s_snippet
                  },
                  {
                    type: 'chips',
                    options: [
                      {
                        text: 'Link to Help Article',
                        link: results.verticalResults[0].results[0].link
                      }
                    ]
                  }
                ]
              ]
          }
          agent.add(new dfff.Payload('PLATFORM_UNSPECIFIED', payloadData, options))
        }
      } else {
        answer = () => agent.add('Sorry! I do not have an answer for that!')
      }

				intentMap.set('Default Fallback Intent', answer)

				agent.handleRequest(intentMap)
			}).catch(err => {
					console.log(err.message)
					res.status(500).send(err.message)
			}
	)

})

app.listen(PORT, () => console.log(`Webhook server is listening, port ${ PORT }`))