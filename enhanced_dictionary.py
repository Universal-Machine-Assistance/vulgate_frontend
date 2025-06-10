#!/usr/bin/env python3
"""
Enhanced Dictionary - Book Information Provider
This script serves as a reference for the enhanced book information
that should be returned by the API endpoint /books/{book_abbr}/enhanced-info
"""

import json
from typing import Dict, List, Any

# Sample enhanced book information data structure
ENHANCED_BOOK_DATA: Dict[str, Dict[str, Any]] = {
    "Gn": {
        "book_name": "Genesis",
        "latin_name": "Liber Genesis",
        "full_name": "In Principio - The Book of Beginnings",
        "summary": "Genesis narra initium mundi et primi homines. Liber primus Sacrae Scripturae continet historiam creationis, primi peccati, diluvii universalis, et vocationem Abrahae. Per narrationes de patriarchis—Abraham, Isaac, Iacob, et Ioseph—fundamenta fidei et promissionum divinarum ponuntur.",
        "key_themes": [
            "Creatio Mundi",
            "Imago Dei", 
            "Peccatum Originale",
            "Foedus Divinum",
            "Promissiones Patriarchis",
            "Providentia Divina"
        ],
        "important_sections": [
            {
                "reference": "Gn 1:1-31",
                "title": "Narratio Creationis",
                "description": "Sex dies creationis mundi et omnium rerum visibilium atque invisibilium."
            },
            {
                "reference": "Gn 3:1-24", 
                "title": "Lapsus Primi Hominis",
                "description": "Historia primi peccati et eius consequentiarum pro genere humano."
            },
            {
                "reference": "Gn 12:1-9",
                "title": "Vocatio Abrahae",
                "description": "Divina vocatio Abrahae et promissio benedictionis omnibus gentibus."
            },
            {
                "reference": "Gn 22:1-19",
                "title": "Sacrificium Isaac",
                "description": "Probatio fidei Abrahae in monte Moriah—typus sacrificii Christi."
            }
        ],
        "historical_context": "Liber Genesis scriptus est ut fundamentum historiae salutis. Traditio Mosaica narrat origines mundi et populi electi. Compositio libri per saecula tradita, finaliter redacta post Exsilium Babylonicum. Narrationes patriarchales radicantur in memoria antiquissima Mesopotamiae et Palaestinae.",
        "literary_genre": "Historia Sacra, Narratio Mythico-Historica",
        "authorship": "Traditio Mosaica (Moses traditus auctor)",
        "date_composed": "c. 1450-400 A.C. (traditio et redactio)",
        "theological_significance": "Genesis revelat Deum Creatorem et Salvatorem. Docet de natura humana ad imaginem Dei creata, de peccato et promissione redemptionis. Establishat foedus cum Abraham quod ad Christum ducit. Fundamentum est totius theologiae biblicae de creatione, peccato, et salute.",
        "notable_figures": [
            "Adam et Eva",
            "Cain et Abel", 
            "Noe",
            "Abraham",
            "Sara",
            "Isaac",
            "Rebecca",
            "Iacob (Israel)",
            "Ioseph",
            "Melchisedech"
        ]
    },
    "Mt": {
        "book_name": "Matthew",
        "latin_name": "Evangelium secundum Matthaeum",
        "full_name": "The Gospel According to Saint Matthew",
        "summary": "Evangelium Matthaei praesentat Iesum Christum ut Messiam promissum Israel. Scripta primario pro Iudaeo-Christianis, demonstrat quomodo Iesus implet omnes prophetias Veteris Testamenti. Continet Sermonem in Monte, parabolas regni caelorum, et passionem cum resurrectione Domini.",
        "key_themes": [
            "Messias Regalis",
            "Regnum Caelorum",
            "Impletio Prophetiarum",
            "Novus Moses",
            "Ecclesia",
            "Disciplina Christiana"
        ],
        "important_sections": [
            {
                "reference": "Mt 5:1-7:29",
                "title": "Sermo in Monte", 
                "description": "Magna carta vitae Christianae—Beatitudines et praecepta evangelica."
            },
            {
                "reference": "Mt 16:13-20",
                "title": "Confessio Petri",
                "description": "Petrus confitetur Iesum esse Christum Filium Dei vivi."
            },
            {
                "reference": "Mt 26:6-28:20",
                "title": "Passio et Resurrectio",
                "description": "Narratio completa passionis, mortis, et resurrectionis Domini."
            },
            {
                "reference": "Mt 28:16-20",
                "title": "Magnum Mandatum",
                "description": "Commissio apostolorum ad evangelizandum omnes gentes."
            }
        ],
        "historical_context": "Evangelium scriptum c. 80-90 A.D. pro communitate Iudaeo-Christiana, probabiliter in Syria vel Palaestina. Auctor utitur fontibus Marcianis et collectione dictorum Iesu (Q). Scripta post destructionem Templi Hierosolymitani.",
        "literary_genre": "Evangelium, Narratio Biografica-Theologica",
        "authorship": "Matthaeus Apostolus (traditio) vel discipulus Matthaei",
        "date_composed": "c. 80-90 A.D.",
        "theological_significance": "Matthaeus demonstrat continuitatem inter Vetus et Novum Testamentum. Iesus est novus Moses qui dat novam Legem. Ecclesia est novus Israel. Regnum caelorum iam incepit sed adhuc expectat consummationem finalem.",
        "notable_figures": [
            "Iesus Christus",
            "Maria Virgo",
            "Ioseph",
            "Ioannes Baptista",
            "Petrus",
            "Duodecim Apostoli",
            "Maria Magdalena",
            "Pontius Pilatus"
        ]
    }
}

def get_enhanced_book_info(book_abbr: str) -> Dict[str, Any]:
    """
    Get enhanced information for a specific book.
    
    Args:
        book_abbr: Book abbreviation (e.g., 'Gn', 'Mt', 'Ps')
        
    Returns:
        Dictionary containing enhanced book information
    """
    if book_abbr in ENHANCED_BOOK_DATA:
        return ENHANCED_BOOK_DATA[book_abbr]
    else:
        # Return a default template for books not yet configured
        return {
            "book_name": book_abbr,
            "latin_name": f"Liber {book_abbr}",
            "full_name": f"Sacred Book {book_abbr}",
            "summary": f"Informatio de libro {book_abbr} adhuc in progressu est. Haec sancta scriptura continet sapientiam et revelationem divinam pro populo Dei.",
            "key_themes": ["Fides", "Spes", "Caritas", "Sapientia Divina"],
            "important_sections": [
                {
                    "reference": f"{book_abbr} 1:1",
                    "title": "Initium Libri",
                    "description": "Prima verba huius sacri libri."
                }
            ],
            "historical_context": "Contextus historicus huius libri adhuc investigatur a scholaribus.",
            "literary_genre": "Scriptura Sacra",
            "authorship": "Auctor divino inspiratus",
            "date_composed": "Tempus antiquum",
            "theological_significance": "Hic liber facit partem divinae revelationis pro salute animarum.",
            "notable_figures": ["Personae Sanctae"]
        }

def main():
    """
    Example usage of the enhanced dictionary function.
    This demonstrates what the API endpoint should return.
    """
    # Example: Get information for Genesis
    genesis_info = get_enhanced_book_info("Gn")
    print("Genesis Enhanced Info:")
    print(json.dumps(genesis_info, indent=2, ensure_ascii=False))
    
    print("\n" + "="*50 + "\n")
    
    # Example: Get information for Matthew  
    matthew_info = get_enhanced_book_info("Mt")
    print("Matthew Enhanced Info:")
    print(json.dumps(matthew_info, indent=2, ensure_ascii=False))

if __name__ == "__main__":
    main() 