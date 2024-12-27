import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from apps.calculator.route import router as calculator_router
from apps.quiz_generator.route import router as quiz_generator_router
from apps.ocr.route import router as ocr_router  # Correct import from apps.ocr

app = FastAPI(
    title="Calculator API",
    description="API for calculator, quiz generator, and OCR scanner",
    version="1.0.0",
    contact={
        "name": "Your Name",
        "email": "your@email.com",
        "url": "https://your-website.com"
    },
    license={
        "name": "MIT License",
        "url": "https://opensource.org/licenses/MIT"
    }
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for testing; you may want to limit this in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def health():
    return {"message": "Server is running"}

# Include the calculator, quiz generator, and OCR routes
app.include_router(calculator_router, prefix="/calculate", tags=["calculate"])
app.include_router(quiz_generator_router, prefix="/quiz", tags=["quiz"])
app.include_router(ocr_router, prefix="/ocr", tags=["ocr"])

if __name__ == "__main__":
    host = os.environ.get("HOST", "127.0.0.1")
    port = int(os.environ.get("PORT", 8900))
    uvicorn.run("main:app", host=host, port=port, reload=True)
