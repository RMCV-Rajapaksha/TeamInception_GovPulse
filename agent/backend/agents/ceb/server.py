import os
import logging
from dotenv import load_dotenv
import sys
parent_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
if parent_dir not in sys.path:
    sys.path.insert(0, parent_dir)
import logging
import click
from dotenv import load_dotenv
from pathlib import Path

# 📦 A2A modules from shared common/ folder
from common.server import A2AServer
from common.types import AgentCard, AgentCapabilities, AgentSkill, MissingAPIKeyError
from common.utils.push_notification_auth import PushNotificationSenderAuth

# 🧠 Local agent and task manager
from agents.ceb.agent import CEBAgent
from agents.ceb.task_manager import AgentTaskManager

# Load environment variables
root_dir = Path(__file__).resolve().parents[3]
dotenv_path = root_dir / ".env"
load_dotenv(dotenv_path=dotenv_path)

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@click.command()
@click.option("--host", default="localhost", help="Host to bind the CEBAgent server.")
@click.option("--port", default=10010, help="Port to serve the CEBAgent.")
def main(host, port):
    print(f"🚀 Starting CEBAgent server at http://{host}:{port}")


    # Define what the agent is capable of
    capabilities = AgentCapabilities(streaming=False, pushNotifications=True)

    # Define agent skill metadata
    skill = AgentSkill(
        id="get_latest_ceb_updates",
        name="ceb Fetcher",
        description="Fetches the latest ceb on a topic.",
        tags=["ceb", "current events", "topics"],
        examples=["What is the latest ceb on AI?", "Give me sports updates"]
    )

    # Define the agent card
    agent_card = AgentCard(
        name="ceb Agent",
        description="Fetches the latest ceb on any topic.",
        url=f"http://{host}:{port}/",
        version="1.0.0",
        defaultInputModes=CEBAgent.SUPPORTED_CONTENT_TYPES,
        defaultOutputModes=CEBAgent.SUPPORTED_CONTENT_TYPES,
        capabilities=capabilities,
        skills=[skill]
    )

    # Setup push notification signing
    notification_sender_auth = PushNotificationSenderAuth()
    notification_sender_auth.generate_jwk()

    # Create the A2A server
    server = A2AServer(
        agent_card=agent_card,
        task_manager=AgentTaskManager(agent=CEBAgent(), notification_sender_auth=notification_sender_auth),
        host=host,
        port=port,
    )

    # Add route for push notification key discovery
    server.app.add_route(
        "/.well-known/jwks.json", notification_sender_auth.handle_jwks_endpoint, methods=["GET"]
    )

    logger.info(f"✅ CEBAgent is live at http://{host}:{port}")
    server.start()

if __name__ == "__main__":
    main()
