"""
utils/helpers.py — Net Sentinel AI
Shared utility functions used across the backend.
"""

import re
import json
from datetime import datetime, timezone
from typing import Any, Dict, List, Optional, Tuple

from bson import ObjectId


class MongoJSONEncoder(json.JSONEncoder):
    """Handles ObjectId and datetime in JSON serialisation."""
    def default(self, obj: Any) -> Any:
        if isinstance(obj, ObjectId):
            return str(obj)
        if isinstance(obj, datetime):
            return obj.isoformat()
        return super().default(obj)


def mongo_doc_to_dict(document: Optional[Dict]) -> Optional[Dict]:
    """Recursively convert a MongoDB document to a JSON-safe dict."""
    if document is None:
        return None

    result = {}
    for key, value in document.items():
        if isinstance(value, ObjectId):
            result[key] = str(value)
        elif isinstance(value, datetime):
            result[key] = value.isoformat()
        elif isinstance(value, dict):
            result[key] = mongo_doc_to_dict(value)
        elif isinstance(value, list):
            result[key] = [
                mongo_doc_to_dict(item) if isinstance(item, dict) else item
                for item in value
            ]
        else:
            result[key] = value
    return result


def docs_to_list(cursor) -> List[Dict]:
    """Convert a PyMongo cursor to a list of JSON-safe dicts."""
    return [mongo_doc_to_dict(doc) for doc in cursor]


def success_response(data: Any, message: str = "Success", status: int = 200) -> Tuple[Dict, int]:
    """Standardised success response for Flask routes."""
    return {"success": True, "message": message, "data": data}, status


def error_response(message: str, status: int = 400, details: Any = None) -> Tuple[Dict, int]:
    """Standardised error response for Flask routes."""
    body = {"success": False, "error": message}
    if details is not None:
        body["details"] = details
    return body, status


def paginate(query_result: list, page: int = 1, per_page: int = 20) -> Dict:
    """Slice a list into a paginated response dict."""
    page     = max(1, page)
    per_page = max(1, min(per_page, 200))
    total    = len(query_result)
    start    = (page - 1) * per_page

    return {
        "items":       query_result[start: start + per_page],
        "page":        page,
        "per_page":    per_page,
        "total":       total,
        "total_pages": (total + per_page - 1) // per_page,
    }


_IPV4_PATTERN = re.compile(r"^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$")

def is_valid_ipv4(ip: str) -> bool:
    """Return True if ip is a valid IPv4 address."""
    match = _IPV4_PATTERN.match(ip or "")
    if not match:
        return False
    return all(0 <= int(g) <= 255 for g in match.groups())


def utcnow() -> datetime:
    return datetime.now(timezone.utc)