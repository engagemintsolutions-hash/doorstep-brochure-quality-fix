FROM python:3.11-slim

WORKDIR /app

# Copy requirements first for better caching
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY backend/ backend/
COPY services/ services/
COPY providers/ providers/
COPY frontend/ frontend/
COPY branding/ branding/
COPY .env.example .env.example
COPY auth_data.json auth_data.json
COPY user_usage_data.json user_usage_data.json

# Create directories for persistent data
RUN mkdir -p uploads brochure_sessions

# Expose port (Railway will override this with $PORT)
EXPOSE 8000

# Start command using shell form to properly expand environment variables
CMD sh -c "uvicorn backend.main:app --host 0.0.0.0 --port ${PORT:-8000}"
