# Simple Chatbot

A simple chatbot powered by Google Gemini AI with both command-line and web interfaces.

## Features

- 💬 Interactive command-line chat interface
- 🌐 Modern web-based chat interface
- 🤖 Powered by Google Gemini AI
- 📱 Responsive design for mobile and desktop

## Setup

1. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

2. **Run the command-line chatbot:**
   ```bash
   python chatbot.py
   ```

3. **Run the web interface:**
   ```bash
   python web_chatbot.py
   ```
   Then open your browser and go to `http://localhost:5000`

## Usage

### Command Line Interface
- Type your messages and press Enter
- Type `quit`, `exit`, or `bye` to end the conversation

### Web Interface
- Open `http://localhost:5000` in your browser
- Type messages in the input field
- Click "Send" or press Enter to send messages

## Files

- `chatbot.py` - Command-line chatbot interface
- `web_chatbot.py` - Flask web server for the web interface
- `templates/index.html` - Web interface HTML template
- `requirements.txt` - Python dependencies
- `README.md` - This file

## API Key

The Google API key is currently hardcoded in the scripts. For production use, consider:
- Using environment variables
- Storing the key in a `.env` file
- Using Google Cloud's authentication methods

## Dependencies

- `google-generativeai` - Google Gemini AI Python SDK
- `flask` - Web framework for the web interface
- `python-dotenv` - Environment variable management

## Notes

- Make sure you have a valid Google AI API key
- The chatbot uses the 'gemini-1.5-flash' model (free tier)
- Web interface runs on `http://localhost:5000` by default 