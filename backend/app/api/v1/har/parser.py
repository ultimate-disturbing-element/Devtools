"""HAR file parser endpoint."""
from fastapi import APIRouter, UploadFile, File, HTTPException
import json
from app.models.file import HARParseResponse, HARRequest

router = APIRouter()


@router.post("/parse", response_model=HARParseResponse)
async def parse_har_file(file: UploadFile = File(...)):
    """Parse HAR file and extract request information.
    
    Args:
        file: HAR file (.har or .json)
    
    Returns:
        Parsed request information
    """
    try:
        content = await file.read()
        har_data = json.loads(content)
        
        entries = har_data.get("log", {}).get("entries", [])
        
        requests = []
        total_size = 0
        total_time = 0
        
        for entry in entries:
            request = entry.get("request", {})
            response = entry.get("response", {})
            timings = entry.get("timings", {})
            
            size = response.get("bodySize", 0)
            if size < 0:
                size = response.get("content", {}).get("size", 0)
            
            time = entry.get("time", 0)
            
            # Extract headers
            headers = {}
            for header in request.get("headers", []):
                headers[header.get("name", "")] = header.get("value", "")
            
            req = HARRequest(
                url=request.get("url", ""),
                method=request.get("method", ""),
                status=response.get("status", 0),
                size=size,
                time=time,
                headers=headers
            )
            
            requests.append(req)
            total_size += size
            total_time += time
        
        return HARParseResponse(
            requests=requests,
            total_requests=len(requests),
            total_size=total_size,
            total_time=round(total_time, 2)
        )
    except json.JSONDecodeError:
        raise HTTPException(status_code=400, detail="Invalid JSON in HAR file")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
