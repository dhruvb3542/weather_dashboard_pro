from flask import Flask, render_template, request, jsonify
import requests

app = Flask(__name__)

# REGISTER FOR A FREE KEY AT: https://openweathermap.org/api
API_KEY = "fab14db5cc97348ac92028ef0952a669"

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/get_weather', methods=['POST'])
def get_weather():
    data = request.get_json()
    city = data.get('city')
    
    if not city:
        return jsonify({"error": "No city provided"}), 400

    url = f"http://api.openweathermap.org/data/2.5/weather?q={city}&appid={API_KEY}&units=metric"
    
    try:
        response = requests.get(url)
        weather_data = response.json()
        
        if response.status_code == 200:
            return jsonify(weather_data)
        else:
            return jsonify({"error": "City not found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    import os
    port = int(os.environ.get("PORT", 5001))
    app.run(host='0.0.0.0', port=port)