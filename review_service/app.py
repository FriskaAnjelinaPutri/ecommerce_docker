from flask import Flask, jsonify, request

app = Flask(__name__)

# Dummy data for reviews
reviews = [
    {"id": 1, "product_id": 101, "review": "Great product!", "rating": 5},
    {"id": 2, "product_id": 102, "review": "Not bad", "rating": 3},
    {"id": 3, "product_id": 101, "review": "Could be better", "rating": 2},
]

# Root endpoint
@app.route('/')
def home():
    return jsonify({"message": "Welcome to the Review Service!"})

# GET all reviews
@app.route('/reviews', methods=['GET'])
def get_reviews():
    return jsonify(reviews)

# GET review by ID
@app.route('/reviews/<int:review_id>', methods=['GET'])
def get_reviews_by_id(review_id):
    review = next((r for r in reviews if r["id"] == review_id), None)
    if review is None:
        return jsonify({"message": "Review not found"}), 404
    return jsonify(review)

# GET reviews by product_id
@app.route('/review/product/<int:product_id>', methods=['GET'])
def get_review_product_by_id(product_id):
    filtered_reviews = [r for r in reviews if r["product_id"] == product_id]
    return jsonify(filtered_reviews)

# CREATE a new review
@app.route('/reviews', methods=['POST'])
def create_review():
    data = request.get_json() or {}

    required_fields = ['product_id', 'review', 'rating']
    missing = [f for f in required_fields if f not in data]

    if missing:
        return jsonify({
            "message": "Missing required fields",
            "missing_fields": missing
        }), 400

    new_id = len(reviews) + 1
    new_review = {
        "id": new_id,
        "product_id": int(data['product_id']),
        "review": data['review'],
        "rating": int(data['rating'])
    }

    reviews.append(new_review)
    return jsonify(new_review), 201


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5002)
