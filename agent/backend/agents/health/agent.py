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

print("🚀 Starting Sri Lanka Health Care Agent setup...")

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

memory = MemorySaver()

@tool
def get_healthcare_info(city: str = "Colombo") -> dict:
    """Returns a hardcoded healthcare service summary for a given Sri Lankan city."""
    print(f"🏥 Fetching healthcare info for '{city}'...")
    
    # Example hardcoded data
    return {
        "city": city,
        "main_hospital": "National Hospital of Sri Lanka" if city.lower() == "colombo" else "District General Hospital",
        "services_available": [
            "Outpatient Department (OPD)",
            "Emergency Services",
            "Maternal and Child Health",
            "Free Medication",
            "Specialist Clinics"
        ],
        "contact_info": {
            "hotline": "1929 (Government Health Hotline)",
            "website": "www.health.gov.lk"
        }
    }


class ResponseFormat(BaseModel):
    status: Literal["input_required", "completed", "error"] = "input_required"
    message: str

class HealthAgent:
    SYSTEM_INSTRUCTION = (
        "You are a helpful assistant that provides accurate and up-to-date information "
        "about Sri Lankan government healthcare services. Use the 'get_healthcare_info' tool "
        "to fetch relevant details based on the user's request (such as hospitals, clinics, services, or programs). "
        "If the user's request is unclear or missing key information (e.g., location or service type), set status to 'input_required'. "
        "Set status to 'completed' once the information is successfully provided. "
        "Use 'error' if something goes wrong or the request cannot be fulfilled."
    )

    def __init__(self):
        print("⚙️ Initializing LangGraph ReAct agent for healthcare tasks...")
        self.model = ChatOpenAI(
            model="gpt-4",
            temperature=0.7,
            api_key=api_key
        )
        self.tools = [get_healthcare_info]

        self.graph = create_react_agent(
            self.model,
            tools=self.tools,
            checkpointer=memory,
            prompt=self.SYSTEM_INSTRUCTION
        )

    async def invoke(self, query: str, session_id: str) -> dict:
        print(f"📩 Received user query: '{query}' | Session ID: '{session_id}'")
        config = {"configurable": {"thread_id": session_id}}
        await self.graph.ainvoke({"messages": [("user", query)]}, config)
        agent_response = self.get_agent_response(config)
        print(f"✅ Agent processed response: {agent_response}")
        return agent_response

    async def stream(self, query: str, session_id: str) -> AsyncIterable[Dict[str, Any]]:
        print(f"📡 Streaming response for query: '{query}' | Session ID: '{session_id}'")
        inputs = {"messages": [("user", query)]}
        config = {"configurable": {"thread_id": session_id}}

        async for item in self.graph.astream(inputs, config, stream_mode="values"):
            message = item["messages"][-1]
            if isinstance(message, AIMessage) and message.tool_calls:
                yield {"is_task_complete": False, "require_user_input": False, "content": "🔍 Gathering health data..."}
            elif isinstance(message, ToolMessage):
                yield {"is_task_complete": False, "require_user_input": False, "content": "🛠️ Processing health report..."}

        yield self.get_agent_response(config)

    def get_agent_response(self, config) -> dict:
        try:
            state = self.graph.get_state(config)
            messages = state.values.get("messages", [])
            
            if messages:
                last_message = messages[-1]
                if hasattr(last_message, 'content') and last_message.content:
                    content = last_message.content
                    print(f"📝 Final AI response content: {content}")
                    
                    is_complete = any(keyword in content.lower() for keyword in [
                        'health', 'wellness', 'medical', 'hospital', 'clinic', 'treatment'
                    ])
                    
                    return {
                        "is_task_complete": is_complete,
                        "require_user_input": not is_complete,
                        "content": content
                    }
            
            print("⚠️ No valid AI messages found. Sending fallback response.")
            return {
                "is_task_complete": False,
                "require_user_input": True,
                "content": "⚠️ Unable to retrieve healthcare information. Please try again."
            }
        except Exception as e:
            print(f"❌ Error while retrieving agent response: {e}")
            return {
                "is_task_complete": False,
                "require_user_input": True,
                "content": f"⚠️ Error processing response: {str(e)}"
            }

    SUPPORTED_CONTENT_TYPES = ["text", "text/plain"]

print("✅ Sri Lanka Health Care Agent is now ready for service!")
