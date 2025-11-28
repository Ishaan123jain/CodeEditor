from fastapi import APIRouter
from ..schemas import AutocompleteRequest, AutocompleteResponse


router = APIRouter()


@router.post("/autocomplete", response_model=AutocompleteResponse)
async def autocomplete(req: AutocompleteRequest):
# Mocked rule-based suggestions
    code = req.code
    lang = req.language.lower()
    cursor = req.cursorPosition


    # naive rule: if the last non-space characters end with 'def ', suggest 'function_name():\n pass'
    tail = code[:cursor].rstrip()
    suggestion = ""
    if tail.endswith("def") or tail.endswith("def "):
        suggestion = "my_function(args):\n pass"
    elif tail.endswith(":" ):
        suggestion = "\n # TODO: implement"
    elif lang == "python" and "import" in tail.split()[-1:]:
        suggestion = " sys"
    else:
        suggestion = "# suggestion: try extracting into a function"


    return {"suggestion": suggestion}