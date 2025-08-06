import os
import logging
from dotenv import load_dotenv
import sys

# 📁 Ensure project root is on sys.path
parent_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
if parent_dir not in sys.path:
    sys.path.insert(0, parent_dir)

import click
from pathlib import Path

# 📦 A2A modules from shared common/ folder
from common.server import A2AServer
from common.types import AgentCard, AgentCapabilities, AgentSkill, MissingAPIKeyError
from common.utils.push_notification_auth import PushNotificationSenderAuth

# Real agent import (already correct)
from agents.health.agent import HealthAgent
from agents.health.task_manager import AgentTaskManager

# 🌍 Load .env from project root
root_dir = Path(__file__).resolve().parents[3]
dotenv_path = root_dir / ".env"
load_dotenv(dotenv_path=dotenv_path)

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@click.command()
@click.option("--host", default="localhost", help="Host to bind the HealthAgent server.")
@click.option("--port", default=10011, help="Port to serve the HealthAgent.")
def main(host, port):
    print(f"🌤️ Starting HealthAgent server at http://{host}:{port}")

    # Uncomment below to validate DeepSeek key if needed
    # if not os.getenv("DEEPSEEK_API_KEY"):
    #     raise MissingAPIKeyError("❌ DEEPSEEK_API_KEY is not set in .env file.")

    capabilities = AgentCapabilities(streaming=False, pushNotifications=True)

    skill = AgentSkill(
        id="get_health",
        name="Health Sector Assistant",
        description="Provides health care information about Sri lankan Goverment hospitals.",
        tags=["health", "wellness", "medical"],
        examples=["What's the health status in Sri Lanka?", "Health forecast in Sri Lanka?"]
    )

    agent_card = AgentCard(
        name="Health Agent",
        description="Gives health information about Sri Lankan Government Health care system.",
        url=f"http://{host}:{port}/",
        version="1.0.0",
        defaultInputModes=HealthAgent.SUPPORTED_CONTENT_TYPES,
        defaultOutputModes=HealthAgent.SUPPORTED_CONTENT_TYPES,
        capabilities=capabilities,
        skills=[skill]
    )

    notification_sender_auth = PushNotificationSenderAuth()
    notification_sender_auth.generate_jwk()

    server = A2AServer(
        agent_card=agent_card,
        task_manager=AgentTaskManager(agent=HealthAgent(), notification_sender_auth=notification_sender_auth),
        host=host,
        port=port,
    )

    server.app.add_route(
        "/.well-known/jwks.json", notification_sender_auth.handle_jwks_endpoint, methods=["GET"]
    )

    logger.info(f"✅ HealthAgent is live at http://{host}:{port}")
    server.start()

if __name__ == "__main__":
    main()
