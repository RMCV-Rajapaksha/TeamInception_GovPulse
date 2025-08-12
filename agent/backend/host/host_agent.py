import sys
import asyncio
import functools
import json
import uuid
import threading
from typing import List, Optional, Callable
import os
import sys
import logging  # added logging
backend_root = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
if backend_root not in sys.path:
    sys.path.insert(0, backend_root)
from google.genai import types
import base64
from dotenv import load_dotenv
from pathlib import Path
from google.adk import Agent
from google.adk.agents.invocation_context import InvocationContext
from google.adk.agents.readonly_context import ReadonlyContext
from google.adk.agents.callback_context import CallbackContext
from google.adk.tools.tool_context import ToolContext
from host.remote_agent_connection import (
    RemoteAgentConnections,
    TaskUpdateCallback
)
from common.client import A2ACardResolver
from common.types import (
    AgentCard,
    Message,
    TaskState,
    Task,
    TaskSendParams,
    TextPart,
    DataPart,
    Part,
    TaskStatusUpdateEvent,
)

root_dir = Path(__file__).resolve().parents[3]
dotenv_path = root_dir / ".env"
load_dotenv(dotenv_path=dotenv_path)

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class HostAgent:
  """The host agent responsible for choosing which remote agents to send
  tasks to and coordinating their work.
  """

  def __init__(
      self,
      remote_agent_addresses: List[str],
      task_callback: TaskUpdateCallback | None = None
  ):
    self.task_callback = task_callback
    self.remote_agent_connections: dict[str, RemoteAgentConnections] = {}
    self.cards: dict[str, AgentCard] = {}
    for address in remote_agent_addresses:
      card_resolver = A2ACardResolver(address)
      card = card_resolver.get_agent_card()
      remote_connection = RemoteAgentConnections(card)
      self.remote_agent_connections[card.name] = remote_connection
      self.cards[card.name] = card
    agent_info = []
    for ra in self.list_remote_agents():
      agent_info.append(json.dumps(ra))
    self.agents = '\n'.join(agent_info)

  def register_agent_card(self, card: AgentCard):
    """Register a new agent card and update remote agent connections."""
    remote_connection = RemoteAgentConnections(card)
    self.remote_agent_connections[card.name] = remote_connection
    self.cards[card.name] = card
    agent_info = []
    for ra in self.list_remote_agents():
      agent_info.append(json.dumps(ra))
    self.agents = '\n'.join(agent_info)

  def create_agent(self) -> Agent:
    """Create and return the main agent with specific tools and instructions."""
    return Agent(
        model="gemini-2.0-flash",
        name="GovPulse_host_agent",
        instruction=self.root_instruction,
        before_model_callback=self.before_model_callback,
        description=(
    "This friendly GovPulse agent helps users by breaking down their requests "
    "into smaller tasks and smartly assigning them to the right agents. "
    "It ensures each user gets clear, simple, and accurate help from the most suitable service."
),
        tools=[
            self.list_remote_agents,
            self.send_task,
            self.create_issue,
        ],
    )

  def root_instruction(self, context: ReadonlyContext) -> str:
    """Provide root instruction for the GovPulse assistant agent."""
    current_agent = self.check_state(context)
    return f"""You are GovPulse – a smart and friendly assistant that helps people by connecting their requests to the right government service, department, or digital agent.

🧭 Your Role – Discovery:

Use list_remote_agents to see all available agents who can help with different kinds of requests.

Ask for more details if the user’s request is unclear or missing important information.

Always use simple language that people can understand easily. Be polite and supportive.

⚙️ Your Role – Execution:

If the task can be done by an agent, use create_task to assign it.

Mention the agent’s name when you let the user know what's happening.

You can also use check_pending_task_states to check on progress if a task is still running.

🧠 Important Notes:

Don’t guess or make up answers — always use tools to get accurate results.

Focus mostly on the latest part of the conversation.

If there’s already an active agent, send the update using update_task.

📌 Agents Available:
{self.agents}

📍 Current Active Agent:
{current_agent['active_agent']}"""

  def check_state(self, context: ReadonlyContext):
    """Check the current active agent from the context state."""
    state = context.state
    if ('session_id' in state and
        'session_active' in state and
        state['session_active'] and
        'agent' in state):
      return {"active_agent": f'{state["agent"]}'}
    return {"active_agent": "None"}

  def before_model_callback(self, callback_context: CallbackContext, llm_request):
    """Callback to initialize or continue session state before the model runs."""
    state = callback_context.state
    if 'session_active' not in state or not state['session_active']:
      if 'session_id' not in state:
        state['session_id'] = str(uuid.uuid4())
      state['session_active'] = True

  def list_remote_agents(self):
    """List the available remote agents to delegate tasks to."""
    if not self.remote_agent_connections:
      return []

    remote_agent_info = []
    for card in self.cards.values():
      remote_agent_info.append(
          {"name": card.name, "description": card.description}
      )
    return remote_agent_info

  async def create_issue(
    self, 
    title: str, 
    description: str, 
    gs_division: str, 
    ds_division: str, 
    urgency_score: float, 
    status_id: int, 
    authority_id: int, 
    category_id: int, 
    image_urls: Optional[List[List[str]]] = None
  ):
    """Create an issue in the database with the provided details."""
    
    if image_urls is None:
        image_urls = []
    
    issue_data = {
        "title": title,
        "description": description,
        "gs_division": gs_division,
        "ds_division": ds_division,
        "urgency_score": urgency_score,
        "status_id": status_id,
        "authority_id": authority_id,
        "category_id": category_id,
        "image_urls": image_urls
    }
    
    logger.info("Issue data to be created:\n%s", json.dumps(issue_data, indent=2))
    
    # Placeholder for real implementation that would save or send issue data.
    logger.info("Issue created successfully with title: %s", title)

  async def send_task(
      self,
      agent_name: str,
      message: str,
      tool_context: ToolContext):
    """Send a task message to a specified remote agent.

    Args:
      agent_name: Name of the remote agent to send the task.
      message: The message content for the task.
      tool_context: Context of the tool during execution.

    Returns:
      A list of response parts from the agent.
    """
    if agent_name not in self.remote_agent_connections:
      raise ValueError(f"Agent {agent_name} not found")
    state = tool_context.state
    state['agent'] = agent_name
    card = self.cards[agent_name]
    client = self.remote_agent_connections[agent_name]
    if not client:
      raise ValueError(f"Client not available for {agent_name}")
    if 'task_id' in state:
      taskId = state['task_id']
    else:
      taskId = str(uuid.uuid4())
    sessionId = state['session_id']
    messageId = ""
    metadata = {}
    if 'input_message_metadata' in state:
      metadata.update(**state['input_message_metadata'])
      if 'message_id' in state['input_message_metadata']:
        messageId = state['input_message_metadata']['message_id']
    if not messageId:
      messageId = str(uuid.uuid4())
    metadata.update(**{'conversation_id': sessionId, 'message_id': messageId})
    request: TaskSendParams = TaskSendParams(
        id=taskId,
        sessionId=sessionId,
        message=Message(
            role="user",
            parts=[TextPart(text=message)],
            metadata=metadata,
        ),
        acceptedOutputModes=["text", "text/plain", "image/png"],
        metadata={'conversation_id': sessionId},
    )
    task = await client.send_task(request, self.task_callback)
    # Update session active status based on task completion state
    state['session_active'] = task.status.state not in [
        TaskState.COMPLETED,
        TaskState.CANCELED,
        TaskState.FAILED,
        TaskState.UNKNOWN,
    ]
    if task.status.state == TaskState.INPUT_REQUIRED:
      # Signal that user input is needed
      tool_context.actions.skip_summarization = True
      tool_context.actions.escalate = True
    elif task.status.state == TaskState.CANCELED:
      raise ValueError(f"Agent {agent_name} task {task.id} is cancelled")
    elif task.status.state == TaskState.FAILED:
      raise ValueError(f"Agent {agent_name} task {task.id} failed")
    response = []
    if task.status.message:
      # Extract and convert message parts
      response.extend(convert_parts(task.status.message.parts, tool_context))
    if task.artifacts:
      for artifact in task.artifacts:
        response.extend(convert_parts(artifact.parts, tool_context))
    return response

def convert_parts(parts: list[Part], tool_context: ToolContext):
  """Convert a list of parts into suitable output formats."""
  rval = []
  for p in parts:
    rval.append(convert_part(p, tool_context))
  return rval

def convert_part(part: Part, tool_context: ToolContext):
  """Convert a single part into text or data, handling file artifacts."""
  if part.type == "text":
    return part.text
  elif part.type == "data":
    return part.data
  elif part.type == "file":
    # Handle file parts by converting and saving them as artifacts.
    file_id = part.file.name
    file_bytes = base64.b64decode(part.file.bytes)    
    file_part = types.Part(
      inline_data=types.Blob(
        mime_type=part.file.mimeType,
        data=file_bytes))
    tool_context.save_artifact(file_id, file_part)
    tool_context.actions.skip_summarization = True
    tool_context.actions.escalate = True
    return DataPart(data = {"artifact-file-id": file_id})
  return f"Unknown type: {part.type}"
