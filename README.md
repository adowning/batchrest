BatchRest
=========

Batch rest calls and receive single response

Included is a synchronous version (batchGetSync) for lighter server load and an asynchronous
version (batchGetAsync) for higher performance.

To run the unit tests, "npm install -g mocha", run the server with "node app" and then run "mocha".

Here is an example of a batch of REST calls:
```
   requests: [
        {
            host: 'jsonplaceholder.typicode.com',
            port: 80,
            command: '/posts/1',
            requestId: 'command1'
        },
        {
            host: 'jsonplaceholder.typicode.com',
            port: 80,
            command: '/albums/1',
            requestId: 'command2'
        }
    ]
```

The response will include one data object for each requested command:
```
  {
    "success": true,
    "responses": {
      "command1": {
        "userId": 1,
        "id": 1,
        "title": "sunt aut facere repellat provident occaecati excepturi optio reprehenderit",
        "body": "quia et suscipit\nsuscipit recusandae consequuntur expedita et cum\nreprehenderit molestiae ut ut quas totam\nnostrum rerum est autem sunt rem eveniet architecto"
      },
      "command2": {
        "userId": 1,
        "id": 1,
        "title": "quidem molestiae enim"
      }
    }
  }
```