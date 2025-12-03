"""CSV to JSON converter endpoint."""
from fastapi import APIRouter, UploadFile, File, HTTPException
from app.services.utils_service import utils_service

router = APIRouter()


@router.post("/to-json")
async def csv_to_json(file: UploadFile = File(...)):
    """Convert CSV file to JSON.
    
    Args:
        file: CSV file
    
    Returns:
        JSON array of objects
    """
    try:
        content = await file.read()
        csv_string = content.decode('utf-8')
        
        result = utils_service.csv_to_json(csv_string)
        
        return {"data": result, "count": len(result)}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
