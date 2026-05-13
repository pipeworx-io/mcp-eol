interface McpToolDefinition {
  name: string;
  description: string;
  inputSchema: {
    type: 'object';
    properties: Record<string, unknown>;
    required?: string[];
  };
}

interface McpToolExport {
  tools: McpToolDefinition[];
  callTool: (name: string, args: Record<string, unknown>) => Promise<unknown>;
  meter?: { credits: number };
  cost?: Record<string, unknown>;
  provider?: string;
}

/**
 * Encyclopedia of Life (EOL) MCP
 *
 * Auth: none. Docs: https://eol.org/docs/what-is-eol/data-services
 */


const BASE = 'https://eol.org/api';
const UA = 'pipeworx-mcp-eol/1.0 (+https://pipeworx.io)';

const tools: McpToolExport['tools'] = [
  {
    name: 'search',
    description: 'Search EOL for a name (common or scientific).',
    inputSchema: {
      type: 'object',
      properties: {
        query: { type: 'string', description: 'e.g. "Panthera leo" or "blue whale"' },
        limit: { type: 'number', description: '1-50 (default 10)' },
      },
      required: ['query'],
    },
  },
  {
    name: 'get_page',
    description: 'Fetch a taxon page by EOL id (synonyms, common names, hierarchy summary).',
    inputSchema: {
      type: 'object',
      properties: {
        id: { type: 'number', description: 'EOL page id (from /search)' },
        detail: { type: 'boolean', description: 'Include data objects (texts, images). Default false.' },
      },
      required: ['id'],
    },
  },
  {
    name: 'pages_by_name',
    description: 'Find EOL page id(s) for an exact scientific name.',
    inputSchema: {
      type: 'object',
      properties: { name: { type: 'string', description: 'e.g. "Panthera leo"' } },
      required: ['name'],
    },
  },
  {
    name: 'hierarchy',
    description: 'Taxonomic hierarchy for a given EOL hierarchy entry id (from get_page).',
    inputSchema: {
      type: 'object',
      properties: { taxon_id: { type: 'number', description: 'taxonConceptID from a page response' } },
      required: ['taxon_id'],
    },
  },
];

async function callTool(name: string, args: Record<string, unknown>): Promise<unknown> {
  switch (name) {
    case 'search': {
      const params = new URLSearchParams({
        q: reqStr(args, 'query', '"blue whale"'),
        page: '1',
        exact: 'false',
      });
      const limit = Math.min(50, Math.max(1, (args.limit as number) ?? 10));
      const data = (await eolGet(`/search/1.0.json?${params}`)) as { results?: unknown[] };
      return { results: (data.results ?? []).slice(0, limit) };
    }
    case 'get_page': {
      const id = (args.id as number) | 0;
      if (!id) throw new Error('Required argument "id" must be a number (EOL page id from /search).');
      const detail = args.detail === true;
      const params = new URLSearchParams({
        common_names: 'true',
        synonyms: 'true',
        taxonomy: 'true',
        details: String(detail),
        cache_ttl: '0',
      });
      return eolGet(`/pages/1.0/${id}.json?${params}`);
    }
    case 'pages_by_name': {
      const name = reqStr(args, 'name', '"Panthera leo"');
      // Search exact, then return the top hits (EOL doesn't have a direct name→id endpoint).
      const params = new URLSearchParams({ q: name, exact: 'true', page: '1' });
      const data = (await eolGet(`/search/1.0.json?${params}`)) as { results?: unknown[] };
      return { name, matches: data.results ?? [] };
    }
    case 'hierarchy': {
      const id = (args.taxon_id as number) | 0;
      if (!id) throw new Error('Required argument "taxon_id" must be a number.');
      return eolGet(`/hierarchy_entries/1.0/${id}.json`);
    }
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

async function eolGet(path: string): Promise<unknown> {
  const res = await fetch(`${BASE}${path}`, { headers: { Accept: 'application/json', 'User-Agent': UA } });
  if (res.status === 404) throw new Error('EOL: not found');
  if (!res.ok) throw new Error(`EOL: ${res.status} ${await res.text().then((t) => t.slice(0, 200))}`);
  return res.json();
}

function reqStr(args: Record<string, unknown>, key: string, example: string): string {
  const v = args[key];
  if (typeof v !== 'string' || !v.trim()) {
    throw new Error(`Required argument "${key}" is missing. Pass a string like ${example}.`);
  }
  return v;
}

export default { tools, callTool, meter: { credits: 1 } } satisfies McpToolExport;
