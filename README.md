# Tracelink MCP Server

MCP server that gives Claude and GitHub Copilot access to the TraceLink API.

## Installation

```bash
npm install
```

## Configuration in Claude Desktop

Add the following to your Claude Desktop config file:

- **macOS:** `~/Library/Application Support/Claude/claude_desktop_config.json`
- **Windows:** `%APPDATA%\Claude\claude_desktop_config.json`

```json
{
  "mcpServers": {
    "tracelink": {
      "command": "node",
      "args": ["/full/path/to/tracelink-mcp/index.js"],
      "env": {
        "TRACELINK_TOKEN": "your-api-token-here"
      }
    }
  }
}
```

Restart Claude Desktop — the server starts automatically.

## Configuration in VS Code (GitHub Copilot)

Requires VS Code 1.99+ and GitHub Copilot with Agent mode enabled.

Create `.vscode/mcp.json` in your workspace:

```json
{
  "servers": {
    "tracelink": {
      "type": "stdio",
      "command": "node",
      "args": ["/full/path/to/tracelink-mcp/index.js"],
      "env": {
        "TRACELINK_TOKEN": "your-api-token-here"
      }
    }
  }
}
```

Tools are then available in Copilot Chat when Agent mode is active.

## Available tools

| Tool | Description |
|---|---|
| `get_company` | Company master data |
| `list_departments` | Departments |
| `get_current_user` | Current authenticated user |
| `list_users` | All users |
| `list_user_groups` | User groups |
| `list_orders` | Orders with filter/sort/paging |
| `get_order` | Specific order |
| `create_order` | Create order |
| `update_order` | Update order |
| `delete_order` | Delete order |
| `list_suborders` | Suborders |
| `get_suborder` | Specific suborder |
| `create_suborder` | Create suborder |
| `list_objects` | Objects from a module (purchase, genobj, customer, ...) |
| `get_object` | Specific object |
| `create_object` | Create object |
| `update_object` | Update object |
| `list_order_module` | Time registrations / tasks on an order |
| `add_order_module` | Add time registration / task |
| `list_journal` | Journal/chat messages on an object |
| `add_journal` | Add message or event to journal |
| `list_relations` | Relations between modules |
