import google.generativeai as genai
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

class SimpleChatbot:
    def __init__(self, api_key):
        """Initialize the chatbot with Google Gemini AI"""
        genai.configure(api_key=api_key)
        self.model = genai.GenerativeModel('gemini-1.5-flash')
        self.chat_history = []
        
    def get_response(self, user_input):
        """Get response from Gemini AI"""
        try:
            response = self.model.generate_content(user_input)
            return response.text
        except Exception as e:
            return f"Sorry, I encountered an error: {str(e)}"
    
    def chat(self):
        """Start the interactive chat session"""
        print("🤖 Simple Chatbot (powered by Google Gemini)")
        print("Type 'quit', 'exit', or 'bye' to end the conversation\n")
        
        while True:
            user_input = input("You: ").strip()
            
            if user_input.lower() in ['quit', 'exit', 'bye']:
                print("🤖 Goodbye! Thanks for chatting!")
                break
            
            if not user_input:
                continue
                
            # Add user input to history
            self.chat_history.append(f"User: {user_input}")
            
            # Get AI response
            response = self.get_response(user_input)
            print(f"🤖 Bot: {response}\n")
            
            # Add bot response to history
            self.chat_history.append(f"Bot: {response}")
    
    def get_chat_history(self):
        """Return the chat history"""
        return self.chat_history

def main():
    # Your Google API key
    API_KEY = "AIzaSyCj6jCLTm8IY0VshEr_fUhQFbdBBGHMTLc"
    
    # Create chatbot instance
    chatbot = SimpleChatbot(API_KEY)
    
    # Start chatting
    chatbot.chat()

if __name__ == "__main__":
    main() 