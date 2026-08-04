# @pipeworx/eol

Encyclopedia of Life (EOL) MCP — biodiversity taxa, common names, images, and trait data from eol.org. Keyless.

Part of [Pipeworx](https://pipeworx.io) — an MCP gateway connecting AI agents to 1394+ live data sources.

## Tools

- `search(query, limit?)` — search EOL for a name (common or scientific)
- `get_page(id, detail?)` — fetch a taxon page by EOL id (synonyms, common names, hierarchy)
- `pages_by_name(name)` — find EOL page id(s) for an exact scientific name
- `hierarchy(taxon_id)` — taxonomic hierarchy for a given EOL hierarchy entry id

## Data source

`https://eol.org/api/`

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

Or connect to the full Pipeworx gateway for access to all 1394+ data sources:

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

- [Docs and guides](https://pipeworx.io/docs)
- [pipeworx.io](https://pipeworx.io)

## License

MIT
