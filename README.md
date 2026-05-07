# Tracelink MCP Server

MCP server der giver Claude og GitHub Copilot adgang til TraceLink API'et.

## Installation

```bash
npm install
```

## Konfiguration i Claude Desktop

Tilføj følgende til `~/Library/Application Support/Claude/claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "tracelink": {
      "command": "node",
      "args": ["/fuld/sti/til/tracelink-mcp/index.js"],
      "env": {
        "TRACELINK_TOKEN": "dit-api-token-her"
      }
    }
  }
}
```

Genstart Claude Desktop — serveren starter automatisk.

## Konfiguration i VS Code (GitHub Copilot)

Kræver VS Code 1.99+ og GitHub Copilot med Agent mode.

Opret `.vscode/mcp.json` i dit workspace:

```json
{
  "servers": {
    "tracelink": {
      "type": "stdio",
      "command": "node",
      "args": ["/fuld/sti/til/tracelink-mcp/index.js"],
      "env": {
        "TRACELINK_TOKEN": "dit-api-token-her"
      }
    }
  }
}
```

Tools er herefter tilgængelige i Copilot Chat når Agent mode er aktivt.

## Tilgængelige tools

| Tool | Beskrivelse |
|---|---|
| `get_company` | Virksomhedens stamdata |
| `list_departments` | Afdelinger |
| `get_current_user` | Aktuel bruger |
| `list_users` | Alle brugere |
| `list_user_groups` | Brugergrupper |
| `list_orders` | Ordrer med filter/sort/paging |
| `get_order` | Specifik ordre |
| `create_order` | Opret ordre |
| `update_order` | Opdater ordre |
| `delete_order` | Slet ordre |
| `list_suborders` | Underordrer |
| `get_suborder` | Specifik underordre |
| `create_suborder` | Opret underordre |
| `list_objects` | Objekter fra modul (purchase, genobj, customer, ...) |
| `get_object` | Specifikt objekt |
| `create_object` | Opret objekt |
| `update_object` | Opdater objekt |
| `list_order_module` | Tidsreg / opgaver på ordre |
| `add_order_module` | Tilføj tidsreg / opgave |
| `list_journal` | Journal/chat beskeder på et objekt |
| `add_journal` | Tilføj besked eller hændelse til journal |
| `list_relations` | Relationer mellem moduler |
