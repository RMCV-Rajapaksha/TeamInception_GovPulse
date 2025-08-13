from langchain_core.tools import tool
from langchain_openai import ChatOpenAI
from langchain_deepseek import ChatDeepSeek
from langgraph.prebuilt import create_react_agent
from langgraph.checkpoint.memory import MemorySaver
from langchain_core.messages import AIMessage, ToolMessage
from typing import AsyncIterable, Any, Dict, Literal
from pydantic import BaseModel
from pathlib import Path
import os
from dotenv import load_dotenv
import time
import sys

parent_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
if parent_dir not in sys.path:
    sys.path.insert(0, parent_dir)

print("🚀 Starting CEB Assistant initialization...")

# Load shared .env from backend directory  
root_dir = Path(__file__).resolve().parents[2]
dotenv_path = root_dir / ".env"
load_dotenv(dotenv_path=dotenv_path)

api_key = os.getenv("OPEN_API_KEY")
os.environ["LANGCHAIN_TRACING_V2"] = "true"
langsmith_key = os.getenv("LANGSMITH_API_KEY")
if langsmith_key:
    os.environ["LANGCHAIN_API_KEY"] = langsmith_key
os.environ["LANGCHAIN_PROJECT"] = "Agent2AgentProtocol"

if not api_key:
    raise EnvironmentError(f"❌ OPEN_API_KEY not found in {dotenv_path}")
else:
    print(f"🔑 OPEN_API_KEY successfully loaded from {dotenv_path}")

# Memory for threading
memory = MemorySaver()

# 🛠️ Tool - for now, returns a hardcoded ceb string
@tool
async def get_latest_ceb_updates(topic: str = "technology") -> dict:
    """Fetches the latest CEB update for a given topic. Returns a dummy but meaningful response."""
    print(f"📢 Fetching latest CEB updates for topic: '{topic}'")
    print("📄 Returning dummy test data for now.")

    dummy_data = {
        "topic": topic,
        "timestamp": time.strftime("%Y-%m-%d %H:%M:%S"),
        "update": (
            f"No scheduled power outages in {topic} areas today. "
            "Routine maintenance work is planned from 9:00 AM to 12:00 PM in selected regions. "
            "Customers may experience brief interruptions during this period."
        ),
        "status": "information"
    }
    return dummy_data


# 🧾 Format for response returned by the agent
class ResponseFormat(BaseModel):
    status: Literal["input_required", "completed", "error"] = "input_required"
    message: str

# 🧠 CEBAgent powered by LangGraph + DeepSeek
class CEBAgent:
    SYSTEM_INSTRUCTION = (
        "You are a CEB assistant. Your role is to help users by providing the latest updates from the Ceylon Electricity Board. "
        "Use the 'get_latest_ceb_updates' tool to answer user questions about power outages, maintenance schedules, billing issues, new projects, or any other CEB-related topics. "
        "You MUST respond only using information from the 'get_latest_ceb_updates' tool. "
        "If the user doesn't specify a topic, default to 'power outages'. "
        "Set status to 'completed' once you successfully provide the relevant update. "
        "Use 'input_required' if the user's request is unclear or missing a specific topic. "
        "Set status to 'error' only if the request fails or data cannot be retrieved."
    )

    def __init__(self):
        print("⚙️ Initializing LangGraph ReAct agent for CEB Assistant...")
        # self.model = ChatDeepSeek(model="deepseek-chat", api_key=api_key)
        self.model = ChatOpenAI(
            model="gpt-4",  # or "gpt-3.5-turbo"
            temperature=0.7,
            api_key=api_key
        )
        self.tools = [get_latest_ceb_updates]

        self.graph = create_react_agent(
            self.model,
            tools=self.tools,
            checkpointer=memory,
            prompt=self.SYSTEM_INSTRUCTION,
            response_format=ResponseFormat
        )
        print("✅ CEB Assistant agent is ready to process queries.")

    async def invoke(self, query: str, session_id: str) -> dict:
        print(f"📝 Received user query: '{query}' | Session: {session_id}")
        config = {"configurable": {"thread_id": session_id}}
        await self.graph.ainvoke({"messages": [("user", query)]}, config)
        agent_response = self.get_agent_response(config)
        print(f"📬 Agent final response: {agent_response}")
        return agent_response

    async def stream(self, query: str, session_id: str) -> AsyncIterable[Dict[str, Any]]:
        print(f"📡 Streaming updates for query: '{query}' | Session: {session_id}")
        inputs = {"messages": [("user", query)]}
        config = {"configurable": {"thread_id": session_id}}

        async for item in self.graph.astream(inputs, config, stream_mode="values"):
            message = item["messages"][-1]
            if isinstance(message, AIMessage) and message.tool_calls:
                yield {
                    "is_task_complete": False,
                    "require_user_input": False,
                    "content": "🔍 Fetching latest CEB update..."
                }
            elif isinstance(message, ToolMessage):
                yield {
                    "is_task_complete": False,
                    "require_user_input": False,
                    "content": "⚡ Processing CEB data..."
                }

        yield self.get_agent_response(config)

    def get_agent_response(self, config) -> dict:
        state = self.graph.get_state(config)
        structured = state.values.get("structured_response")
        if isinstance(structured, ResponseFormat):
            print(f"✅ Structured agent output: {structured}")
            return {
                "is_task_complete": structured.status == "completed",
                "require_user_input": structured.status == "input_required",
                "content": structured.message
            }

        print("⚠️ No structured response found — sending fallback message.")
        return {
            "is_task_complete": False,
            "require_user_input": True,
            "content": "⚠️ Unable to process the request. Please try again."
        }

    SUPPORTED_CONTENT_TYPES = ["text", "text/plain"]

print("🎯 CEB Assistant setup complete. Ready for action.")
