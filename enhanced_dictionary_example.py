#!/usr/bin/env python3
"""
Enhanced Dictionary API Example
This shows what the GET /api/v1/dictionary/books/{book_name} endpoint should return

This is a reference implementation showing the expected data structure
for the BookInfoPanel React component.
"""

import json
from typing import Dict, List, Any

def get_enhanced_book_info(book_abbr: str) -> Dict[str, Any]:
    """
    Returns enhanced book information for the given book abbreviation
    
    Args:
        book_abbr: Book abbreviation (e.g., "Gn", "Mt", "Ps")
        
    Returns:
        Dictionary containing enhanced book information
    """
    
    # Sample data - in real implementation, this would come from AI processing
    # and database storage
    sample_books = {
        "Gn": {
            "book_name": "Genesis",
            "latin_name": "Liber Genesis",
            "full_name": "Liber Primus Moysi qui Genesis dicitur",
            "summary": "Genesis narrat de creatione mundi, primi hominis lapsu, diluvio Noachi, et initiis populi electi per Abraham, Isaac, et Jacob. Liber fundamentalis qui exponit origines humanitatis et foederis Dei cum hominibus.",
            "key_themes": [
                "Creatio",
                "Peccatum Originale", 
                "Foedus Divinum",
                "Promissiones Patriarchis",
                "Providentia Dei"
            ],
            "important_sections": [
                {
                    "reference": "Gn 1:1-31",
                    "title": "Creatio Mundi",
                    "description": "Narratio sex dierum creationis et sabbati"
                },
                {
                    "reference": "Gn 3:1-24", 
                    "title": "Lapsus Adami",
                    "description": "Peccatum primi hominis et expulsio de Paradiso"
                },
                {
                    "reference": "Gn 12:1-9",
                    "title": "Vocatio Abrahae",
                    "description": "Promissio divina et initium populi electi"
                },
                {
                    "reference": "Gn 22:1-19",
                    "title": "Sacrificium Isaac",
                    "description": "Probatio fidei Abrahae et praefiguratio Christi"
                }
            ],
            "historical_context": "Genesis scripta est circa saeculum XV ante Christum a Moyse, continens traditiones antiquissimas de originibus mundi et populi Hebraici. Liber compositus est ex diversis fontibus traditionalibus qui in unum corpus redacti sunt.",
            "literary_genre": "Narratio historico-theologica",
            "authorship": "Moyses (traditio), cum redactoribus posterioribus",
            "date_composed": "c. 1450-1200 a.C.",
            "theological_significance": "Genesis est fundamentum totius revelationis biblicae, exponens naturam Dei Creatoris, dignitatem humanam, realityatem peccati, et spem redemptionis. Praeparat viam ad intelligendum opus salvificum Christi.",
            "notable_figures": [
                "Adam",
                "Eva", 
                "Abel",
                "Noe",
                "Abraham",
                "Isaac",
                "Jacob",
                "Joseph"
            ],
            "cover_image_url": None
        },
        "Mt": {
            "book_name": "Matthew",
            "latin_name": "Evangelium secundum Matthaeum",
            "full_name": "Sanctum Evangelium Domini Nostri Iesu Christi secundum Matthaeum",
            "summary": "Evangelium Matthaei praecipue ad Iudaeos scriptum, demonstrat Iesum esse Messiam promissum qui Legem adimplet et Regnum Caelorum instaurit. Continet Sermonem in Monte et multas parabolas de Regno.",
            "key_themes": [
                "Iesus Messias",
                "Regnum Caelorum",
                "Adimpletio Legis",
                "Ecclesia",
                "Iudicium Finale"
            ],
            "important_sections": [
                {
                    "reference": "Mt 5:1-7:29",
                    "title": "Sermo in Monte",
                    "description": "Magna carta vitae christianae et Beatitudines"
                },
                {
                    "reference": "Mt 16:13-20",
                    "title": "Confessio Petri",
                    "description": "Petrus confitetur Iesum esse Filium Dei vivi"
                },
                {
                    "reference": "Mt 28:16-20",
                    "title": "Mandatum Missionis",
                    "description": "Iesus mittit Apostolos ad docendas omnes gentes"
                }
            ],
            "historical_context": "Scriptum circa annum 80-90 post Christum, probabiliter Antiochiae, ad communitatem Iudaeo-christianam. Evangelista utitur fonte Marco et collectione dictorum Iesu (Q).",
            "literary_genre": "Evangelium narrativum cum discursibus didacticis",
            "authorship": "Matthaeus Apostolus (traditio), vel discipulus eius",
            "date_composed": "c. 80-90 p.C.",
            "theological_significance": "Mattheus demonstrat continuitatem inter Vetus et Novum Testamentum, ostendens Iesum esse culminem promissionum divinarum et fundamentum Ecclesiae universalis.",
            "notable_figures": [
                "Iesus Christus",
                "Maria Virgo",
                "Ioseph",
                "Ioannes Baptista",
                "Petrus",
                "Duodecim Apostoli"
            ],
            "cover_image_url": None
        },
        "Ps": {
            "book_name": "Psalms",
            "latin_name": "Liber Psalmorum", 
            "full_name": "Liber Psalmorum Davidis et aliorum",
            "summary": "Psalmi sunt carmina sacra et orationes populi Israel, expressa in laudibus, petitionibus, lamentationibus, et meditationibus de Deo et eius operibus. Cor Veteris Testamenti et oratio Ecclesiae.",
            "key_themes": [
                "Laus Dei",
                "Oratio et Petitio",
                "Paenitentia",
                "Sapientia",
                "Messias Rex"
            ],
            "important_sections": [
                {
                    "reference": "Ps 23(22)",
                    "title": "Dominus regit me",
                    "description": "Psalmus fiduciae in Deum pastorem"
                },
                {
                    "reference": "Ps 51(50)",
                    "title": "Miserere",
                    "description": "Psalmus paenitentiae et misericordiae"
                },
                {
                    "reference": "Ps 110(109)",
                    "title": "Messias Rex et Sacerdos",
                    "description": "Prophetia de Christo rege et sacerdote"
                }
            ],
            "historical_context": "Collectio psalmorum composita per multa saecula (c. 1000-300 a.C.), a tempore David usque ad periodum post-exilicam. Multi psalmi attribuuntur David regi.",
            "literary_genre": "Poesis religiosa et hymnographia",
            "authorship": "David, Asaph, filii Core, aliique psalmistae",
            "date_composed": "c. 1000-300 a.C.",
            "theological_significance": "Psalmi exprimunt totam vitam spiritualem hominis coram Deo: gaudium, dolorem, spem, timorem. Sunt oratio Christi et Ecclesiae per omnia saecula.",
            "notable_figures": [
                "David Rex",
                "Asaph",
                "Filii Core",
                "Ethan",
                "Salomon"
            ],
            "cover_image_url": None
        }
    }
    
    return sample_books.get(book_abbr, {
        "book_name": book_abbr,
        "latin_name": f"Liber {book_abbr}",
        "full_name": f"Liber Sacer {book_abbr}",
        "summary": f"Informatio de libro {book_abbr} nondum disponibilis. Utere functione regenerationis AI ad creandam descriptionem completam.",
        "key_themes": ["Theme 1", "Theme 2", "Theme 3"],
        "important_sections": [
            {
                "reference": f"{book_abbr} 1:1",
                "title": "Sectio Prima",
                "description": "Descriptio sectionis primae"
            }
        ],
        "historical_context": "Contextus historicus nondum determinatus.",
        "literary_genre": "Genus literarium nondum classificatum",
        "authorship": "Auctor incertus",
        "date_composed": "Data compositionis incerta",
        "theological_significance": "Significatio theologica nondum explorata.",
        "notable_figures": ["Figura 1", "Figura 2"],
        "cover_image_url": None
    })

def regenerate_book_info_with_ai(book_abbr: str) -> Dict[str, Any]:
    """
    Regenerate book information using AI analysis
    This would integrate with your AI processing pipeline
    
    Args:
        book_abbr: Book abbreviation
        
    Returns:
        Updated book information dictionary
    """
    # This is where you would call your AI processing
    # For now, return the same structure
    print(f"🤖 AI regenerating information for book: {book_abbr}")
    return get_enhanced_book_info(book_abbr)

# Example FastAPI endpoints (for reference)
"""
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Enhanced Dictionary API")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/v1/dictionary/books/{book_name}")
async def get_book_info(book_name: str):
    \"\"\"Get enhanced book information\"\"\"
    try:
        info = get_enhanced_book_info(book_name)
        return info
    except Exception as e:
        raise HTTPException(status_code=404, detail=f"Book {book_name} not found")

@app.post("/api/v1/dictionary/books/{book_name}/regenerate")
async def regenerate_book_info(book_name: str):
    \"\"\"Regenerate book information with AI\"\"\"
    try:
        info = regenerate_book_info_with_ai(book_name)
        return {"status": "success", "message": f"Book {book_name} regenerated", "data": info}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to regenerate book {book_name}")

@app.get("/api/v1/dictionary/books")
async def list_books():
    \"\"\"List all available books\"\"\"
    books = ["Gn", "Ex", "Lv", "Nm", "Dt", "Jos", "Jdc", "Ru", "1Sm", "2Sm", 
             "1Kg", "2Kg", "1Chr", "2Chr", "Ezr", "Neh", "Tb", "Jdt", "Est", 
             "Job", "Ps", "Pr", "Qo", "Sg", "Wis", "Sir", "Is", "Jer", "Lam", 
             "Bar", "Ez", "Dn", "Hos", "Jl", "Am", "Ob", "Jon", "Mi", "Na", 
             "Hab", "Zep", "Hg", "Zec", "Mal", "Mt", "Mk", "Lk", "Jn", "Acts", 
             "Rom", "1Cor", "2Cor", "Gal", "Eph", "Phil", "Col", "1Th", "2Th", 
             "1Tim", "2Tim", "Tit", "Phlm", "Heb", "Jas", "1Pet", "2Pet", 
             "1Jn", "2Jn", "3Jn", "Jude", "Rev"]
    return {"books": books}

@app.get("/api/v1/dictionary/books/stats")
async def get_book_stats():
    \"\"\"Get cache and processing statistics\"\"\"
    return {
        "total_books": 73,
        "processed_books": 25,
        "cache_hit_ratio": 0.85,
        "last_updated": "2024-01-15T10:30:00Z"
    }
"""

if __name__ == "__main__":
    # Example usage
    print("📚 Enhanced Dictionary Example")
    print("=" * 50)
    
    # Test Genesis
    genesis_info = get_enhanced_book_info("Gn")
    print(f"Book: {genesis_info['book_name']}")
    print(f"Latin: {genesis_info['latin_name']}")
    print(f"Summary: {genesis_info['summary'][:100]}...")
    print(f"Themes: {', '.join(genesis_info['key_themes'])}")
    print()
    
    # Show JSON structure
    print("JSON Structure for API:")
    print(json.dumps(genesis_info, indent=2, ensure_ascii=False)) 