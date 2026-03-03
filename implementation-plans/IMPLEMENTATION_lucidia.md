# 🚀 IMPLEMENTATION PLAN: lucidia
## Multi-Model AI Orchestration Layer

**Repo**: `blackboxprogramming/lucidia`
**Purpose**: AI orchestration, multi-model routing, agent intelligence
**Phase**: **Phase 1 (Q3-Q4) → Phase 2 (Expansion)**

---

## PURPOSE

**Lucidia** is the **AI intelligence layer** that:
- Routes requests to self-hosted models via Ollama on Pi cluster (Llama, Mistral, Phi, Gemma)
- Orchestrates multi-agent conversations
- Manages long-term memory and context
- Provides personas (Cece, Amundson, etc.)
- Tool calling and function execution
- Zero external provider dependency (fully self-hosted)

**Role in Architecture**: **Layer 4** (Orchestration & Intelligence)

**Domain**: `lucidia.blackroad.systems` (API), `lucidia.earth` (narrative site, Phase 2)

---

## CORE ARCHITECTURE

### 1. Multi-Model Router

```python
# lucidia/router.py
import httpx
import os

class ModelRouter:
    def __init__(self):
        self.ollama_url = os.getenv("OLLAMA_BASE_URL", "http://localhost:11434")

    async def route(self, prompt: str, preferences: dict):
        """Route to best self-hosted model based on task."""

        # Task classification
        task_type = self.classify_task(prompt)

        # Routing logic — all models self-hosted via Ollama on Pi cluster
        if task_type == "code":
            return await self.call_ollama(prompt, model="codellama:13b")
        elif task_type == "creative":
            return await self.call_ollama(prompt, model="llama3:8b")
        elif task_type == "fast":
            return await self.call_ollama(prompt, model="phi3:mini")
        else:
            # Default to Llama 3
            return await self.call_ollama(prompt, model="llama3:8b")

    async def call_ollama(self, prompt: str, model: str = "llama3:8b"):
        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"{self.ollama_url}/api/generate",
                json={"model": model, "prompt": prompt, "stream": False},
                timeout=120.0
            )
            response.raise_for_status()
            return response.json()["response"]
```

### 2. Multi-Agent Orchestration

```python
# lucidia/orchestrator.py
class AgentOrchestrator:
    def __init__(self):
        self.agents = {
            "cece": Agent(name="Cece", role="OS Architect", model="llama3:8b"),
            "amundson": Agent(name="Amundson", role="Quantum Physicist", model="llama3:8b"),
            "designer": Agent(name="Designer", role="UI/UX", model="mistral:7b"),
        }

    async def orchestrate(self, task: str):
        """Orchestrate multiple agents to complete a complex task."""

        # Step 1: Analyze task
        plan = await self.agents["cece"].plan(task)

        # Step 2: Execute subtasks
        results = []
        for subtask in plan.subtasks:
            agent = self.agents[subtask.agent]
            result = await agent.execute(subtask.description)
            results.append(result)

        # Step 3: Synthesize results
        final = await self.agents["cece"].synthesize(results)
        return final
```

### 3. Long-Term Memory

```python
# lucidia/memory.py
from chromadb import Client

class Memory:
    def __init__(self):
        self.chroma = Client()
        self.collection = self.chroma.create_collection("lucidia_memory")

    async def store(self, text: str, metadata: dict):
        """Store conversation or context."""
        self.collection.add(
            documents=[text],
            metadatas=[metadata],
            ids=[str(uuid.uuid4())]
        )

    async def recall(self, query: str, n_results: int = 5):
        """Retrieve relevant context."""
        results = self.collection.query(
            query_texts=[query],
            n_results=n_results
        )
        return results
```

---

## INTEGRATION WITH BLACKROAD OS

### API Endpoints

**In `blackroad-api`** (proxy to Lucidia):
```python
# app/routers/lucidia.py
from fastapi import APIRouter
import httpx

router = APIRouter(prefix="/api/lucidia", tags=["lucidia"])

@router.post("/chat")
async def chat(message: str, model: str = "auto"):
    async with httpx.AsyncClient() as client:
        response = await client.post(
            "https://lucidia.blackroad.systems/chat",
            json={"message": message, "model": model}
        )
        return response.json()

@router.post("/orchestrate")
async def orchestrate(task: str):
    """Multi-agent task orchestration."""
    async with httpx.AsyncClient() as client:
        response = await client.post(
            "https://lucidia.blackroad.systems/orchestrate",
            json={"task": task}
        )
        return response.json()
```

### OS App Integration

**Lucidia Core App** (in OS UI):
```javascript
// backend/static/js/apps/lucidia.js
window.Apps.Lucidia = {
    init() {
        this.messages = [];
    },

    async sendMessage(message) {
        const response = await fetch('/api/lucidia/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message, model: 'auto' })
        });
        const data = await response.json();
        this.messages.push({ role: 'user', content: message });
        this.messages.push({ role: 'assistant', content: data.response });
        this.render();
    },

    render() {
        return `
            <div class="lucidia-chat">
                ${this.messages.map(msg => `
                    <div class="message ${msg.role}">
                        <strong>${msg.role}:</strong> ${msg.content}
                    </div>
                `).join('')}
                <input type="text" id="lucidia-input" placeholder="Ask Lucidia...">
                <button onclick="Apps.Lucidia.sendMessage(document.getElementById('lucidia-input').value)">Send</button>
            </div>
        `;
    }
};
```

---

## REPOSITORY STRUCTURE

```
lucidia/
├── lucidia/
│   ├── __init__.py
│   ├── router.py          # Multi-model routing
│   ├── orchestrator.py    # Multi-agent orchestration
│   ├── memory.py          # Long-term memory (ChromaDB)
│   ├── personas.py        # Cece, Amundson, etc.
│   ├── tools.py           # Function calling
│   └── config.py          # Model configs, API keys
├── api/
│   └── main.py            # FastAPI service
├── tests/
│   ├── test_router.py
│   ├── test_orchestrator.py
│   └── test_memory.py
├── requirements.txt
├── Dockerfile
└── README.md
```

---

## TECHNOLOGY STACK

**Core**:
- Python 3.11+
- FastAPI (API service)
- Ollama (self-hosted LLM runtime on Pi cluster)
- httpx (async HTTP client for Ollama API)
- ChromaDB (vector memory)

**Self-Hosted Models** (via Ollama):
- Llama 3 8B (general purpose)
- CodeLlama 13B (code generation)
- Mistral 7B (creative/reasoning)
- Phi-3 Mini (fast/lightweight tasks)

---

## PHASE 1 MILESTONES

**Month 6-7**: Basic multi-model routing
**Month 8-9**: Multi-agent orchestration
**Month 10-11**: Long-term memory integration
**Month 12**: Production deployment, OS integration

**Success Criteria**:
- ✅ 3+ self-hosted models running on Pi cluster (Llama 3, CodeLlama, Mistral, Phi-3)
- ✅ <5s average response time (self-hosted hardware)
- ✅ 95% user satisfaction
- ✅ 10+ personas available
- ✅ Zero external API dependencies

---

## PHASE 2 EXPANSION

**lucidia.earth** (Narrative Site):
- Public-facing AI experiences
- Interactive stories
- AI art gallery
- Community showcase

**Advanced Features**:
- Fine-tuned models (custom Lucidia models)
- Multimodal (image, audio, video)
- Real-time collaboration (multiple users + AI)

---

## CLOUDFLARE & DOMAINS

**DNS Records**:

| Type | Name | Target | Proxy |
|------|------|--------|-------|
| CNAME | lucidia.blackroad | `lucidia-api.up.railway.app` | ✅ |
| CNAME | lucidia.earth | `lucidia-narrative.vercel.app` | ✅ |

---

## COST OPTIMIZATION

**Self-Hosted Model Cost**:
- All models run on Pi cluster — zero per-token API costs
- One-time hardware cost: Raspberry Pi 5 cluster
- Electricity only ongoing cost
- No vendor lock-in, no rate limits, no API keys

**Strategy**:
- Use Phi-3 Mini for simple queries (classification, summarization)
- Use CodeLlama 13B for code generation and analysis
- Use Llama 3 8B for general reasoning and conversation
- Use Mistral 7B for creative tasks
- Cache common queries in Redis

**Projected Savings**: 100% vs. using external AI providers

---

**Last Updated**: 2025-11-18
