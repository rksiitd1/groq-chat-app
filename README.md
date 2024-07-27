# Groq Chat App

Groq Chat App is an open-source chat application built with React. It demonstrates how to create a simple chat interface that can be integrated with various backend services.

## Features

- Multiple chat conversations
- Real-time message updates
- Markdown-style formatting for messages
- Responsive design for desktop and mobile use

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- Node.js (v14 or later recommended)
- npm (comes with Node.js)

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/rksiitd1/groq-chat-app.git
   ```

2. Navigate to the project directory:
   ```
   cd groq-chat-app
   ```

3. Install dependencies:
   ```
   npm install
   ```

4. Create a `.env` file in the root directory and add your configuration:
   ```
   GROQ_API_KEY=your-api-key
   ```

5. Start the development server:
   ```
   npm start
   ```

The app should now be running on [http://localhost:3000](http://localhost:3000).

## Customizing the Backend

This project is designed to work with any compatible chat API. To integrate your own backend:

1. Update the `GROQ_API_KEY` in the `.env` file to point to your API.
2. Modify the `sendMessage` function in `GroqChatApp.js` to match your API's request/response format.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Thanks to the React community for providing excellent documentation and resources.
- Inspired by various open-source chat applications and UI designs.

