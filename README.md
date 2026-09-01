# Tracelink MCP Server

MCP server that gives Claude, ChatGPT and GitHub Copilot access to the Tracelink API.

There are two ways to connect: a **hosted HTTPS server** (recommended) or the **local stdio server** in this repo.

- **HTTPS** — Tracelink hosts the server at `https://tracelink.dk/api/mcp`. Your client talks to it directly over the internet, authenticating with an API key in the `x-access-token` header. No installation, no local process, always up to date, and it exposes a broader/better tool set (e.g. document upload, tags, relations, schema introspection).
- **stdio** — the client starts this repo's `index.js` as a local child process and talks to it over stdin/stdout. Requires Node.js, a local checkout, and `npm install`.

**The stdio server in this repo is no longer being actively developed and will be removed at a later point.** New setups should use the hosted HTTPS server below; existing stdio configurations should migrate when convenient.

## Recommended: hosted HTTPS server

Connect directly to Tracelink's hosted MCP server at `https://tracelink.dk/api/mcp`. This requires no local installation — just an API key sent via the `x-access-token` header.

You can configure this either by editing the config file directly (examples below), or through the user interface:

- **Claude Desktop:** Settings → Connectors → Add custom connector, enter the URL `https://tracelink.dk/api/mcp` and add a header named `x-access-token` with your API key.
- **VS Code:** Run the command "MCP: Add Server" from the Command Palette, choose "HTTP", enter the URL `https://tracelink.dk/api/mcp`, and add a header named `x-access-token` with your API key.

### Claude Desktop

```json
{
  "mcpServers": {
    "tracelink": {
      "type": "http",
      "url": "https://tracelink.dk/api/mcp",
      "headers": {
        "x-access-token": "your-api-key-here"
      }
    }
  }
}
```

### VS Code (GitHub Copilot)

```json
{
  "servers": {
    "tracelink": {
      "type": "http",
      "url": "https://tracelink.dk/api/mcp",
      "headers": {
        "x-access-token": "your-api-key-here"
      }
    }
  }
}
```

### ChatGPT

Custom MCP connectors require Developer mode, which must be enabled first:

1. Go to **Settings → Connectors → Advanced settings** and turn on **Developer mode**.
2. Go back to **Settings → Connectors** and click **Create** (or **Add custom connector**).
3. Fill in a name (e.g. `Tracelink`), and set the **MCP Server URL** to `https://tracelink.dk/api/mcp`.
4. Under **Authentication**, choose the API key / custom header option, set the header name to `x-access-token`, and enter your API key as the value.
5. Save, then enable the **Tracelink** connector in a chat via the **+ → More → Connectors** menu (or in Deep Research) to make its tools available.

Availability of custom connectors and the exact menu wording depends on your ChatGPT plan (Plus/Pro/Team/Enterprise) and may change over time.

## Local stdio server (deprecated)

> ⚠️ This local server is no longer actively developed and will be removed at a later point. Use the [hosted HTTPS server](#recommended-hosted-https-server) above instead.

### Installation

```bash
npm install
```

### Configuration in Claude Desktop

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

### Configuration in VS Code (GitHub Copilot)

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

### Available tools (stdio server)

The hosted HTTPS server exposes a broader tool set (including document upload, tags, relations, and schema introspection); the table below lists only what the local stdio server supports.

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
