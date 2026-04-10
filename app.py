from flask import Flask, render_template, jsonify, request
import datetime

app = Flask(__name__)

# --- DATA ---
inventory_db = [
    {"id": 1, "name": "maths ", "stock": 14, "status": "In Stock", "last_update": "10:00 AM"},
    {"id": 2, "name": "Microchips (A1)", "stock": 150, "status": "Stable", "last_update": "09:30 AM"},
    {"id": 3, "name": "Lithium Packs", "stock": 8, "status": "Low Stock", "last_update": "11:15 AM"},
]

# --- FRONTEND ROUTE ---
@app.route('/')
def index():
    return render_template('index.html')

# --- API ENDPOINTS ---
@app.route('/api/inventory', methods=['GET'])
def get_inventory():
    return jsonify(inventory_db)

@app.route('/api/stock-update', methods=['POST'])
def update_stock():
    data = request.json
    item_id = data.get('id')
    change = data.get('change')
    
    for item in inventory_db:
        if item['id'] == item_id:
            item['stock'] = max(0, item['stock'] + change)
            item['last_update'] = datetime.datetime.now().strftime("%I:%M %p")
            if item['stock'] < 10: item['status'] = "Critical"
            elif item['stock'] < 25: item['status'] = "Low Stock"
            else: item['status'] = "Stable"
            return jsonify(item)
    return jsonify({"error": "Not found"}), 404

# --- NEW BACKEND INTERACTIVE ROUTE ---
@app.route('/admin/stats')
def admin_stats():
    total_stock = sum(item['stock'] for item in inventory_db)
    low_stock_items = [item['name'] for item in inventory_db if item['stock'] < 10]
    return {
        "status": "Healthy",
        "total_volume": total_stock,
        "alerts": low_stock_items,
        "timestamp": datetime.datetime.now().isoformat()
    }

# --- START SERVER ---
if __name__ == '__main__':
    app.run(debug=True, port=8000)