from pydantic import BaseModel

class MusicRequest(BaseModel):
    index_request : int

class SearchContent(BaseModel):
    search_content: str
