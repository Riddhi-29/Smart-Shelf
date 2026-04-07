# Smart Shelf - Kirana Store Inventory Assistant 🏪

An AI-powered inventory management system designed for small grocery (kirana) shop owners. Automatically tracks expiry dates, sends alerts for low stock and near-expiry items, and uses AI to parse invoices and suggest flash sales.

## Features

### Core MVP
- **Inventory Dashboard**: Add, edit, and delete inventory items with name, quantity, unit, and expiry date
- **Alert Panel**: Real-time notifications for low stock and near-expiry items
- **Persistent Database**: PostgreSQL backend to save and persist all inventory data

### AI Features
- **Invoice Parser**: Paste messy invoice text or upload invoice images - AI extracts items automatically
- **Image-to-Text OCR**: Uses Groq Vision API to read invoice images directly
- **Semantic Search**: Fuzzy matching for product names, auto-corrects typos
- **Flash Sale Suggester**: AI recommends discount percentages for near-expiry items

## Tech Stack

- **Frontend**: React.js + TypeScript + Vite + Tailwind CSS
- **Backend**: FastAPI (Python) with async support
- **Database**: PostgreSQL with SQLAlchemy (async)
- **AI/LLM**: Groq API (Llama models with Vision support)

## Project Structure

```
kirana/
├── backend/
│   ├── app/
│   │   ├── api/routes/       # API endpoints
│   │   ├── core/             # Config, database, Groq client
│   │   ├── models/           # SQLAlchemy models
│   │   ├── schemas/          # Pydantic schemas
│   │   ├── services/         # Business logic (AI, parsing)
│   │   ├── crud/             # Database operations
│   │   └── main.py           # FastAPI app entry
│   ├── requirements.txt
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── components/       # React components
│   │   ├── hooks/            # Custom React hooks
│   │   ├── services/         # API client
│   │   └── types/            # TypeScript types
│   ├── package.json
│   └── vite.config.ts
└── README.md
```

## Prerequisites

- **Python** 3.10+
- **Node.js** 18+
- **PostgreSQL** 14+
- **Groq API Key** (get from https://console.groq.com/keys)

## Installation & Setup

### 1. Clone and Navigate
```bash
cd kirana
```

### 2. Backend Setup

```bash
# Navigate to backend
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Linux/Mac:
source venv/bin/activate
# On Windows:
# venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
cp .env.example .env

# Edit .env with your credentials:
# DATABASE_URL=postgresql+asyncpg://postgres:postgres@localhost:5432/kirana
# GROQ_API_KEY=your_groq_api_key_here
```

### 3. Database Setup

```bash
# Create PostgreSQL database
psql -U postgres -c "CREATE DATABASE kirana;"

# Tables are created automatically on first run
```

### 4. Frontend Setup

```bash
# Navigate to frontend
cd ../frontend

# Install dependencies
npm install

# Create .env file (optional - for custom API URL)
echo "VITE_API_URL=http://localhost:8000" > .env
```

## Running the Application

### Start Backend
```bash
cd backend
source venv/bin/activate  # Activate venv if not already
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Backend will be available at: http://localhost:8000
API docs at: http://localhost:8000/docs

### Start Frontend
```bash
cd frontend
npm run dev
```

Frontend will be available at: http://localhost:5173

## API Endpoints

### Inventory
- `GET /inventory` - List all items (paginated)
- `POST /inventory` - Create new item
- `GET /inventory/{id}` - Get single item
- `PUT /inventory/{id}` - Update item
- `DELETE /inventory/{id}` - Delete item

### Alerts
- `GET /alerts/summary` - Get alert summary (counts + items)
- `GET /alerts/low-stock` - Get low stock items
- `GET /alerts/near-expiry` - Get near-expiry items

### Invoice Parser
- `POST /invoice/parse` - Parse invoice (text or image)
- `POST /invoice/parse-and-add` - Parse and add to inventory

### Flash Sale
- `GET /flash-sale/suggestions` - Get AI discount suggestions

## Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | Required |
| `GROQ_API_KEY` | Groq API key for AI features | Required |
| `LOW_STOCK_THRESHOLD` | Items below this quantity trigger alerts | 10 |
| `NEAR_EXPIRY_DAYS` | Days before expiry to trigger alerts | 7 |

## Usage Guide

### Adding Items Manually
1. Click "Add Item" button on Inventory page
2. Fill in item details (name, quantity, expiry date)
3. Click "Add Item" to save

### Parsing Invoices
1. Go to "Invoice Parser" page
2. Either:
   - **Paste Text**: Copy-paste your invoice text (messy format is OK)
   - **Upload Image**: Upload a photo of your invoice
3. Click "Parse Invoice"
4. Review extracted items
5. Click "Add All to Inventory" to save

### Flash Sale Suggestions
1. Go to "Flash Sale" page
2. View AI-generated discount suggestions for near-expiry items
3. Each suggestion includes:
   - Item name
   - Days until expiry
   - Recommended discount percentage
   - Reason for suggestion

## Groq Models Used

- **Text Processing**: `llama-3.3-70b-versatile` - For invoice parsing and flash sale suggestions
- **Vision/OCR**: `meta-llama/llama-4-scout-17b-16e-instruct` - For reading invoice images

## Development

### Running Tests
```bash
# Backend tests
cd backend
pytest

# Frontend tests
cd frontend
npm test
```

### Building for Production
```bash
# Frontend build
cd frontend
npm run build
# Output in dist/

# Backend - use gunicorn
cd backend
gunicorn app.main:app -w 4 -k uvicorn.workers.UvicornWorker
```

## Troubleshooting

### Database Connection Issues
- Ensure PostgreSQL is running: `sudo systemctl start postgresql`
- Check DATABASE_URL format: `postgresql+asyncpg://user:pass@host:port/db`

### Groq API Errors
- Verify your API key is valid at https://console.groq.com
- Check rate limits if you get 429 errors

### Frontend Not Connecting to Backend
- Ensure backend is running on port 8000
- Check CORS settings in backend
- Verify VITE_API_URL in frontend .env

## License

MIT License - feel free to use for your kirana store!

---

Built with ❤️ for small business owners
