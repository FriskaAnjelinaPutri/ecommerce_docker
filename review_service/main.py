from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from database import reviews_collection
from bson import ObjectId

app = FastAPI()

# =======================
# ✅ CORS (WAJIB)
# =======================
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # dev mode
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# =======================
# MODEL
# =======================
class Review(BaseModel):
    product_id: int
    review: str
    rating: int


# =======================
# HELPER
# =======================
def review_serializer(review) -> dict:
    return {
        "id": str(review["_id"]),
        "product_id": review["product_id"],
        "review": review["review"],
        "rating": review["rating"],
    }


# ================= CREATE =================
@app.post("/reviews", status_code=201)
def create_review(review: Review):
    try:
        result = reviews_collection.insert_one(review.dict())
        return {
            "success": True,
            "message": "Review created successfully",
            "id": str(result.inserted_id)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ================= READ ALL =================
@app.get("/reviews")
def get_reviews():
    reviews = reviews_collection.find()
    data = [review_serializer(r) for r in reviews]
    return {
        "success": True,
        "data": data
    }


# ================= READ BY PRODUCT =================
@app.get("/reviews/product/{product_id}")
def get_reviews_by_product(product_id: int):
    reviews = reviews_collection.find({"product_id": product_id})
    data = [review_serializer(r) for r in reviews]
    return {
        "success": True,
        "data": data
    }


# ================= UPDATE =================
@app.put("/reviews/{review_id}")
def update_review(review_id: str, review: Review):
    try:
        result = reviews_collection.update_one(
            {"_id": ObjectId(review_id)},
            {"$set": review.dict()}
        )

        if result.matched_count == 0:
            raise HTTPException(status_code=404, detail="Review not found")

        return {
            "success": True,
            "message": "Review updated successfully"
        }

    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


# ================= DELETE =================
@app.delete("/reviews/{review_id}")
def delete_review(review_id: str):
    try:
        result = reviews_collection.delete_one(
            {"_id": ObjectId(review_id)}
        )

        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Review not found")

        return {
            "success": True,
            "message": "Review deleted successfully"
        }

    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
