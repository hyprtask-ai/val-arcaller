"""MCP session instructions should follow PRODUCT_NAME branding."""

from api.constants import PRODUCT_NAME
from api.mcp_server import instructions as instructions_module
from api.mcp_server.server import mcp


def test_mcp_instructions_include_product_name():
    assert PRODUCT_NAME in instructions_module.DOGRAH_MCP_INSTRUCTIONS
    assert "Dograh voice-AI" not in instructions_module.DOGRAH_MCP_INSTRUCTIONS


def test_mcp_server_name_matches_product_slug():
    assert mcp.name == PRODUCT_NAME.lower()
