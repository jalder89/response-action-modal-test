const { App } = require('@slack/bolt');

// Initializes your app with your bot token and signing secret
const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET
});

// Listens to incoming messages that contain "Give me a button"
app.message('give me a button', async ({ message, say }) => {
    // say() sends a message to the channel where the event was triggered
    await say({
      blocks: [
        {
          "type": "section",
          "text": {
            "type": "mrkdwn",
            "text": `Here is your button <@${message.user}>!`
          },
          "accessory": {
            "type": "button",
            "text": {
              "type": "plain_text",
              "text": "Click Me"
            },
            "action_id": "open_modal_a"
          }
        }
      ],
      text: `Here is your button <@${message.user}>!`
    });
});

// Listens to incoming interactivity for the button with Action ID "button_click"
app.action('open_modal_a', async ({ body, ack, client, logger }) => {
    // Acknowledge the action
    await ack();
    
    try {
        // Call views.open with the built-in client
        const result = await client.views.open({
          // Pass a valid trigger_id within 3 seconds of receiving it
          trigger_id: body.trigger_id,
          // View payload
          view: {
            type: 'modal',
            // View identifier
            callback_id: 'view_1',
            title: {
              type: 'plain_text',
              text: 'Modal A'
            },
            blocks: [
              {
                type: 'section',
                text: {
                  type: 'mrkdwn',
                  text: 'Welcome to a modal with _blocks_'
                },
                accessory: {
                  type: 'button',
                  text: {
                    type: 'plain_text',
                    text: 'Click me!'
                  },
                  action_id: 'button_abc'
                }
              },
              {
                type: 'input',
                block_id: 'input_a',
                label: {
                  type: 'plain_text',
                  text: 'What are your hopes and dreams?'
                },
                element: {
                  type: 'plain_text_input',
                  action_id: 'dreamy_input',
                  multiline: true
                }
              }
            ],
            submit: {
              type: 'plain_text',
              text: 'Submit'
            }
          }
        });
        logger.info(JSON.stringify(result.view.state.values));
      }
      catch (error) {
        logger.error(error);
      }
});

// Handle a view_submission request
app.view('view_1', async ({ ack, body, view, client, logger }) => {
    // Acknowledge the view_submission request
    await ack(
        {
        "response_action": "push",
        "view": {
          "type": "modal",
          "callback_id": "view_2",
          "title": {
            "type": "plain_text",
            "text": "Updated view"
          },
          "blocks": [
            {
              "type": "image",
              "image_url": "https://api.slack.com/img/blocks/bkb_template_images/plants.png",
              "alt_text": "Plants"
            },
            {
              "type": "context",
              "elements": [
                {
                  "type": "mrkdwn",
                  "text": "_Two of the author's cats sit aloof from the austere challenges of modern society_"
                }
              ]
            },
            {
                "type": "input",
                "block_id": "input_b",
                "element": {
                    "type": "plain_text_input",
                    "action_id": "thoughtful_input"
                },
                "label": {
                    "type": "plain_text",
                    "text": "Label",
                    "emoji": true
                }
            }
          ],
          submit: {
            type: 'plain_text',
            text: 'Submit'
          }
        }
      }
      );
  
    // Do whatever you want with the input data - here we're saving it to an object then sending the user a verifcation of their submission
  
    // Assume there's an input block with `block_1` as the block_id and `input_a`
    const val = view['state']['values']['input_a'];
    const user = body['user']['id'];
  
    // Message to send user
    let msg = '';
    // Save to DB
    const results = {
        "input": user.input, 
        "value": val
    };
  
    if (results) {
      // DB save was successful
      msg = 'Your submission was successful, here is your state: ' + JSON.stringify(view.state);
    } else {
      msg = 'There was an error with your submission';
    }
  
    // Message the user
    try {
      await client.chat.postMessage({
        channel: user,
        text: msg
      });
    }
    catch (error) {
      logger.error(error);
    }
  
});

app.view('view_2', async ({ ack, body, view, client, logger }) => {
    // Acknowledge the view_submission request
    await ack({
        "response_action": "push",
        "view": {
            "id": "V03TLU53WJJ",
            "team_id": "TC7BTJR8X",
            "type": "modal",
            "blocks": [
              {
                "type": "section",
                "block_id": "P3X",
                "text": {
                  "type": "plain_text",
                  "text": "Before we close the incident, double check that everything below looks good.",
                  "emoji": true
                }
              },
              {
                "type": "input",
                "block_id": "name",
                "label": {
                  "type": "plain_text",
                  "text": "Incident Name",
                  "emoji": true
                },
                "hint": {
                  "type": "plain_text",
                  "text": "A sentence long description of what has happened.",
                  "emoji": true
                },
                "optional": false,
                "dispatch_action": false,
                "element": {
                  "type": "plain_text_input",
                  "action_id": "value",
                  "initial_value": "this happens for inidents.io",
                  "dispatch_action_config": {
                    "trigger_actions_on": [
                      "on_enter_pressed"
                    ]
                  }
                }
              },
              {
                "type": "input",
                "block_id": "severity_01G8TZSZYGNV020PXH7WK75N00",
                "label": {
                  "type": "plain_text",
                  "text": "Severity",
                  "emoji": true
                },
                "optional": false,
                "dispatch_action": true,
                "element": {
                  "type": "static_select",
                  "action_id": "value",
                  "initial_option": {
                    "text": {
                      "type": "plain_text",
                      "text": "Major",
                      "emoji": true
                    },
                    "value": "01G8TZSZYGEZ55WPYNEK8HJ1HS"
                  },
                  "options": [
                    {
                      "text": {
                        "type": "plain_text",
                        "text": "Minor",
                        "emoji": true
                      },
                      "value": "01G8TZSZYG3C926FFTM6B9SCN0"
                    },
                    {
                      "text": {
                        "type": "plain_text",
                        "text": "Major",
                        "emoji": true
                      },
                      "value": "01G8TZSZYGEZ55WPYNEK8HJ1HS"
                    },
                    {
                      "text": {
                        "type": "plain_text",
                        "text": "Critical",
                        "emoji": true
                      },
                      "value": "01G8TZSZYGS28WGZAGQCY03055"
                    }
                  ]
                }
              },
              {
                "type": "context",
                "block_id": "severity_hint",
                "elements": [
                  {
                    "type": "mrkdwn",
                    "text": "Issues causing significant impact. Immediate response is usually required. We might have some workarounds that mitigate the impact on customers. Examples include an important sub-system failing.",
                    "verbatim": false
                  }
                ]
              },
              {
                "type": "input",
                "block_id": "summary",
                "label": {
                  "type": "plain_text",
                  "text": "Summary",
                  "emoji": true
                },
                "hint": {
                  "type": "plain_text",
                  "text": "Your current understanding of what happened in the incident, and the impact it had. It's fine to go into detail here.",
                  "emoji": true
                },
                "optional": false,
                "dispatch_action": false,
                "element": {
                  "type": "plain_text_input",
                  "action_id": "value",
                  "placeholder": {
                    "type": "plain_text",
                    "text": "Think about what you'd like to read if you were coming to the incident with no context",
                    "emoji": true
                  },
                  "initial_value": "papapa",
                  "multiline": true,
                  "dispatch_action_config": {
                    "trigger_actions_on": [
                      "on_enter_pressed"
                    ]
                  }
                }
              },
              {
                "type": "input",
                "block_id": "role_01G8TZSZYGK2385X67YHZXYMY1",
                "label": {
                  "type": "plain_text",
                  "text": "Incident Lead",
                  "emoji": true
                },
                "optional": false,
                "dispatch_action": true,
                "element": {
                  "type": "external_select",
                  "action_id": "value",
                  "initial_option": {
                    "text": {
                      "type": "plain_text",
                      "text": "yunusz (Yunus Zaytaev)",
                      "emoji": true
                    },
                    "value": "01GA9BZRZTX7J8RQPAAAV785YA"
                  },
                  "min_query_length": 0
                }
              },
              {
                "type": "context",
                "block_id": "role_01G8TZSZYGK2385X67YHZXYMY1_hint",
                "elements": [
                  {
                    "type": "plain_text",
                    "text": "The person currently coordinating the incident, tasked with driving it to resolution and ensuring clear internal and external communication with stakeholders and customers.",
                    "emoji": true
                  }
                ]
              },
              {
                "type": "divider",
                "block_id": "5evf"
              },
              {
                "type": "context",
                "block_id": "uQmt",
                "elements": [
                  {
                    "type": "mrkdwn",
                    "text": "information_source Did you know, you can add your own <https:\\/\\/app.incident.io\\/settings\\/custom-fields|custom fields that appear here?>",
                    "verbatim": false
                  }
                ]
              }
            ],
            "callback_id": "IncidentClose",
            "state": {
              "values": {
                "severity_01G8TZSZYGNV020PXH7WK75N00": {
                  "value": {
                    "type": "static_select",
                    "selected_option": {
                      "text": {
                        "type": "plain_text",
                        "text": "Major",
                        "emoji": true
                      },
                      "value": "01G8TZSZYGEZ55WPYNEK8HJ1HS"
                    }
                  }
                },
                "status": {
                  "value": {
                    "type": "static_select",
                    "selected_option": {
                      "text": {
                        "type": "plain_text",
                        "text": "Closed",
                        "emoji": true
                      },
                      "value": "closed"
                    }
                  }
                },
                "message": {
                  "value": {
                    "type": "plain_text_input",
                    "value": null
                  }
                }
              }
            },
            "hash": "1660643619.udsoHojS",
            "title": {
              "type": "plain_text",
              "text": "Close incident",
              "emoji": true
            },
            "clear_on_close": false,
            "notify_on_close": false,
            "close": {
              "type": "plain_text",
              "text": "Cancel",
              "emoji": true
            },
            "submit": {
              "type": "plain_text",
              "text": "Save",
              "emoji": true
            },
            "previous_view_id": null,
            "root_view_id": "V03TLU53WJJ",
            "app_id": "A01DEGPUHHC",
            "external_id": "",
            "app_installed_team_id": "TC7BTJR8X",
            "bot_id": "B03R8PB607K"
          }
      });
  
    // Do whatever you want with the input data - here we're saving it to an object then sending the user a verifcation of their submission
  
    // Assume there's an input block with `block_1` as the block_id and `input_a`
    const val = view['state']['values']['input_b'];
    const user = body['user']['id'];
  
    // Message to send user
    let msg = '';
    // Save to DB
    const results = {
        "input": user.input, 
        "value": val
    };
  
    if (results) {
      // DB save was successful
      msg = 'Your submission was successful, here is your state: ' + JSON.stringify(view.state);
    } else {
      msg = 'There was an error with your submission';
    }
  
    // Message the user
    try {
      await client.chat.postMessage({
        channel: user,
        text: msg
      });
    }
    catch (error) {
      logger.error(error);
    }
  
});

app.view('IncidentClose', async ({ack, body, view, client, logger}) => {
    await ack({
        "response_action": "clear"
    });

    console.log(JSON.stringify(view.state))
});

(async () => {
  // Start your app
  await app.start(Number(process.env.PORT || 3000));

  console.log('⚡️ Bolt app is running!');
})();