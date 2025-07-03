from flask import Flask, render_template, request, jsonify, send_from_directory
import google.generativeai as genai
import os

app = Flask(__name__)

# Configure Google Gemini AI using environment variable
API_KEY = os.getenv("GOOGLE_API_KEY", "AIzaSyCj6jCLTm8IY0VshEr_fUhQFbdBBGHMTLc")
genai.configure(api_key=API_KEY)
model = genai.GenerativeModel('gemini-1.5-flash')

@app.route('/')
def home():
    """Main MedPharm business site"""
    return render_template('demo.html')

@app.route('/chat')
def chat_interface():
    """Direct chatbot interface"""
    return render_template('index.html')

@app.route('/demo')
def demo():
    """Alternative route for business demo page"""
    return render_template('demo.html')

@app.route('/embed.js')
def embed_widget():
    """Serve the embeddable widget"""
    return send_from_directory('static', 'embed.js', mimetype='application/javascript')

@app.route('/api/chat', methods=['POST'])
def chat_api():
    try:
        user_message = request.json.get('message')
        is_widget = request.json.get('widget', False)
        
        if not user_message:
            return jsonify({'error': 'No message provided'}), 400
        
        # Enhanced medical context for healthcare professionals
        medical_context = """You are MedPharm AI, a specialized medical pharmacy assistant for healthcare professionals. Provide accurate, concise medical information:

🔄 DRUG INTERACTION CHECKING:
- Analyze interactions with severity levels (major/moderate/minor)
- Provide mechanism of action for interactions
- Suggest alternative medications when appropriate

📏 DOSAGE CALCULATIONS:  
- Show step-by-step calculations with formulas
- Include pediatric, adult, and geriatric considerations
- Factor in renal/hepatic adjustments when relevant

⚠️ SAFETY & COMPLIANCE:
- Include contraindications and warnings
- Mention monitoring parameters
- Use standard medical terminology

💊 RESPONSE FORMAT:
- Start with appropriate emoji
- Provide clinical details and evidence
- Be concise but thorough
- Note: Information should be verified for critical decisions

Question: """
        
        # Add medical context for all requests
        full_prompt = medical_context + user_message
        
        # Generate response using Gemini
        response = model.generate_content(full_prompt)
        bot_response = response.text
        
        return jsonify({'response': bot_response})
    
    except Exception as e:
        return jsonify({'error': f'Sorry, I encountered an error: {str(e)}'}), 500

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    debug_mode = os.environ.get('FLASK_ENV') == 'development'
    
    if debug_mode:
        print("🩺 Starting MedPharm AI Business Platform...")
        print("🏢 Main Business Site: http://localhost:5000")
        print("💬 Direct Chatbot: http://localhost:5000/chat") 
        print("🎯 Click the widget on main site to demo!")
        print("⚡ Ready to help with medical questions!")
    
    app.run(debug=debug_mode, host='0.0.0.0', port=port) 