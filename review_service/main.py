from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from database import reviews_collection

app = FastAPI()

class Review(BaseModel):
    product_id: int
    review: str
    rating: int


@app.post("/reviews", status_code=201)
def create_review(review: Review):
    data = {
        "product_id": review.product_id,
        "review": review.review,
        "rating": review.rating
    }

    try:
        insert_result = reviews_collection.insert_one(data)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    # ⚠️ RESPONSE HARUS JSON MURNI
    return {
        "success": True,
        "message": "Review created successfully",
        "review_id": str(insert_result.inserted_id)
    }


@app.get("/reviews")
def get_reviews():
    reviews = list(reviews_collection.find({}, {"_id": 0}))
    return {
        "success": True,
        "data": reviews
    }


@app.get("/reviews/{product_id}")
def get_reviews_by_product(product_id: int):
    reviews = list(
        reviews_collection.find(
            {"product_id": product_id},
            {"_id": 0}
        )
    )
    return {
        "success": True,
        "data": reviews
    }
