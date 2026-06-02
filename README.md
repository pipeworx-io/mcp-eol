# mcp-eol

Encyclopedia of Life (EOL) MCP

Part of [Pipeworx](https://pipeworx.io) — an MCP gateway connecting AI agents to 673+ live data sources.

## Tools

| Tool | Description |
|------|-------------|
| `search` | Search EOL for a name (common or scientific). |
| `get_page` | Fetch a taxon page by EOL id (synonyms, common names, hierarchy summary). |
| `pages_by_name` | Find EOL page id(s) for an exact scientific name. |
| `hierarchy` | Taxonomic hierarchy for a given EOL hierarchy entry id (from get_page). |

## Quick Start

Add to your MCP client (Claude Desktop, Cursor, Windsurf, etc.):

```json
{
  "mcpServers": {
    "eol": {
      "url": "https://gateway.pipeworx.io/eol/mcp"
    }
  }
}
```

Or connect to the full Pipeworx gateway for access to all 673+ data sources:

```json
{
  "mcpServers": {
    "pipeworx": {
      "url": "https://gateway.pipeworx.io/mcp"
    }
  }
}
```

## Using with ask_pipeworx

Instead of calling tools directly, you can ask questions in plain English:

```
ask_pipeworx({ question: "your question about Eol data" })
```

The gateway picks the right tool and fills the arguments automatically.

## More

- [All tools and guides](https://github.com/pipeworx-io/examples)
- [pipeworx.io](https://pipeworx.io)

## License

MIT
