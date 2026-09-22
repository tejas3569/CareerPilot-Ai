import math
import re
import hashlib
from typing import List
from app.config import settings

def cosine_similarity(vec1: List[float], vec2: List[float]) -> float:
    """Calculate the cosine similarity between two float vectors."""
    if not vec1 or not vec2 or len(vec1) != len(vec2):
        return 0.0
    
    dot = sum(a * b for a, b in zip(vec1, vec2))
    norm1 = math.sqrt(sum(a * a for a in vec1))
    norm2 = math.sqrt(sum(b * b for b in vec2))
    
    if norm1 == 0.0 or norm2 == 0.0:
        return 0.0
    
    sim = dot / (norm1 * norm2)
    # Clamp to [0.0, 1.0]
    return max(0.0, min(1.0, float(sim)))

class EmbeddingService:
    """
    Embedding service supporting external AI models (Gemini / OpenAI)
    and a robust offline semantic subword & term-frequency vectorizer.
    """
    def __init__(self):
        self.gemini_client = None
        if settings.GEMINI_API_KEY:
            try:
                from google import genai
                self.gemini_client = genai.Client(api_key=settings.GEMINI_API_KEY)
            except Exception as e:
                print(f"[EmbeddingService] Warning: Could not initialize Gemini client: {e}")

    def _generate_local_vector(self, text: str, dim: int = 256) -> List[float]:
        """
        Deterministic, high-quality term-frequency and character n-gram hashing vectorizer.
        Generates an L2-normalized float vector that captures semantic keywords and context.
        """
        if not text:
            return [0.0] * dim

        vec = [0.0] * dim
        # Tokenize words and clean
        words = re.findall(r"\b[a-zA-Z0-9_\-\.\#\+]+\b", text.lower())
        
        # Word-level weights
        for w in words:
            # Hash to index
            h = int(hashlib.md5(w.encode("utf-8")).hexdigest(), 16)
            idx = h % dim
            # Frequency weight + length bonus for technical terms
            weight = 1.0 + min(len(w) / 5.0, 2.0)
            vec[idx] += weight

        # Subword 3-gram & 4-gram weights for capturing morphological & keyword similarities
        for w in words:
            if len(w) >= 3:
                for i in range(len(w) - 2):
                    trigram = w[i:i+3]
                    h = int(hashlib.sha256(trigram.encode("utf-8")).hexdigest(), 16)
                    idx = h % dim
                    vec[idx] += 0.35

        # L2 Normalize vector
        norm = math.sqrt(sum(x * x for x in vec))
        if norm > 0.0:
            vec = [x / norm for x in vec]

        return vec

    def get_embedding(self, text: str) -> List[float]:
        """
        Fetch vector embedding for text.
        Uses Gemini embeddings if configured; otherwise uses high-fidelity local vectorizer.
        """
        clean = text.strip()[:6000]
        if not clean:
            return [0.0] * 256

        # Try Gemini API if key is available
        if self.gemini_client and settings.GEMINI_API_KEY:
            try:
                response = self.gemini_client.models.embed_content(
                    model=settings.EMBEDDING_MODEL or "text-embedding-004",
                    contents=clean
                )
                if hasattr(response, "embedding") and hasattr(response.embedding, "values"):
                    return list(response.embedding.values)
                elif hasattr(response, "embeddings") and len(response.embeddings) > 0:
                    return list(response.embeddings[0].values)
            except Exception as err:
                print(f"[EmbeddingService] Gemini API embedding error: {err}. Falling back to local vectorizer.")

        # Local vectorizer fallback
        return self._generate_local_vector(clean)

    def calculate_similarity(self, text1: str, text2: str) -> float:
        """
        Calculate semantic similarity score between two texts in [0.0, 1.0].
        """
        vec1 = self.get_embedding(text1)
        vec2 = self.get_embedding(text2)
        return cosine_similarity(vec1, vec2)

embedding_service = EmbeddingService()
