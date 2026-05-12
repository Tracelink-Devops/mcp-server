import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { TracelinkClient } from "tracelink-api";
import { z } from "zod";

const client = new TracelinkClient({
  access_token: process.env.TRACELINK_TOKEN,
});

const server = new McpServer({
  name: "tracelink",
  version: "1.0.0",
});

// ─── Helpers ────────────────────────────────────────────────────────────────

const toText = (data) => ({
  content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
});

const list_options_schema = {
  filter:     z.record(z.string()).optional().describe("Filterfelt, f.eks. { locked: '=0', name: 'Stål' }"),
  filter_or:  z.boolean().optional().describe("Brug OR i stedet for AND på filter"),
  sort:       z.union([z.string(), z.array(z.string())]).optional().describe("Sorteringsfelt(er)"),
  reverse:    z.boolean().optional().describe("Omvendt sortering"),
  limit:      z.number().optional().describe("Max antal rækker (max 1000)"),
  page:       z.number().optional().describe("Sidenummer, 0-indekseret"),
};

// ─── Company ────────────────────────────────────────────────────────────────

server.tool(
  "get_company",
  "Henter Tracelink virksomhedens stamdata",
  {},
  async () => toText(await client.company.get())
);

server.tool(
  "list_departments",
  "Henter liste over afdelinger i virksomheden",
  {},
  async () => toText(await client.company.listDepartments())
);

// ─── Users ───────────────────────────────────────────────────────────────────

server.tool(
  "get_current_user",
  "Henter den aktuelt autentificerede bruger",
  {},
  async () => toText(await client.user.get())
);

server.tool(
  "list_users",
  "Henter liste over alle brugere i systemet",
  {},
  async () => toText(await client.user.list())
);

server.tool(
  "list_user_groups",
  "Henter liste over brugergrupper",
  {},
  async () => toText(await client.user.listGroups())
);

// ─── Orders ──────────────────────────────────────────────────────────────────

server.tool(
  "list_orders",
  "Henter liste over ordrer. Brug ved spørgsmål om aktive ordrer, deadlines, status eller fremdrift.",
  list_options_schema,
  async (opts) => toText(await client.order.list(opts))
);

server.tool(
  "get_order",
  "Henter en specifik ordre med alle detaljer",
  {
    order_id: z.number().describe("Ordre ID"),
  },
  async ({ order_id }) => toText(await client.order.get(order_id))
);

server.tool(
  "create_order",
  "Opretter en ny ordre i Tracelink",
  {
    number:      z.string().optional().describe("Ordrenummer"),
    name:        z.string().describe("Ordrenavn"),
    description: z.string().optional().describe("Beskrivelse"),
    deadline_date: z.string().optional().describe("Deadline dato, format: 'YYYY-MM-DD HH:MM:SS'"),
    metadata_1:  z.string().optional(),
    metadata_2:  z.string().optional(),
    metadata_3:  z.string().optional(),
    metadata_4:  z.string().optional(),
    metadata_5:  z.string().optional(),
  },
  async (data) => toText(await client.order.create(data))
);

server.tool(
  "update_order",
  "Opdaterer en eksisterende ordre",
  {
    order_id:    z.number().describe("Ordre ID"),
    name:        z.string().optional().describe("Nyt navn"),
    description: z.string().optional().describe("Ny beskrivelse"),
    deadline_date: z.string().optional().describe("Ny deadline, format: 'YYYY-MM-DD HH:MM:SS'"),
    metadata_1:  z.string().optional(),
    metadata_2:  z.string().optional(),
    metadata_3:  z.string().optional(),
    metadata_4:  z.string().optional(),
    metadata_5:  z.string().optional(),
  },
  async ({ order_id, ...fields }) => toText(await client.order.update(order_id, fields))
);

server.tool(
  "delete_order",
  "Sletter en ordre permanent",
  {
    order_id: z.number().describe("Ordre ID der skal slettes"),
  },
  async ({ order_id }) => toText(await client.order.delete(order_id))
);

// ─── Suborders ───────────────────────────────────────────────────────────────

server.tool(
  "list_suborders",
  "Henter liste over underordrer",
  list_options_schema,
  async (opts) => toText(await client.suborder.list(opts))
);

server.tool(
  "get_suborder",
  "Henter en specifik underordre",
  {
    order_sub_id: z.number().describe("Underordre ID"),
  },
  async ({ order_sub_id }) => toText(await client.suborder.get(order_sub_id))
);

server.tool(
  "create_suborder",
  "Opretter en underordre på en eksisterende ordre",
  {
    order_id:    z.number().describe("Overordnet ordre ID"),
    number:      z.string().optional().describe("Underordre nummer"),
    name:        z.string().describe("Navn på underordren"),
    description: z.string().optional(),
  },
  async ({ order_id, ...data }) => toText(await client.suborder.create(order_id, data))
);

// ─── Objects (Modules) ───────────────────────────────────────────────────────

const module_names = ["purchase", "genobj", "customer", "supplier", "crm", "docs", "batch_genobj", "stockloc", "ticket", "bait"];

server.tool(
  "list_objects",
  `Henter objekter fra et Tracelink modul. Tilgængelige moduler: ${module_names.join(", ")}`,
  {
    module: z.enum(module_names).describe("Modulnavn"),
    ...list_options_schema,
  },
  async ({ module, ...opts }) => toText(await client.object.list(module, opts))
);

server.tool(
  "get_object",
  "Henter et specifikt objekt fra et modul",
  {
    module:    z.enum(module_names).describe("Modulnavn"),
    object_id: z.number().describe("Objekt ID"),
  },
  async ({ module, object_id }) => toText(await client.object.get(module, object_id))
);

server.tool(
  "create_object",
  "Opretter et nyt objekt i et modul (f.eks. en indkøbsordre, kunde, leverandør)",
  {
    module: z.enum(module_names).describe("Modulnavn"),
    data:   z.record(z.unknown()).describe("Feltværdier for objektet"),
  },
  async ({ module, data }) => toText(await client.object.create(module, data))
);

server.tool(
  "update_object",
  "Opdaterer et objekt i et modul",
  {
    module: z.enum(module_names).describe("Modulnavn"),
    data:   z.record(z.unknown()).describe("Feltværdier inkl. ID-felt"),
  },
  async ({ module, data }) => toText(await client.object.update(module, data))
);

// ─── Order Modules (timereg, task, osv.) ─────────────────────────────────────

const order_module_names = ["timereg", "task"];

server.tool(
  "list_order_module",
  "Henter registreringer fra et ordre-modul, f.eks. tidsregistreringer eller opgaver",
  {
    module:   z.enum(order_module_names).describe("Modulnavn: timereg eller task"),
    order_id: z.number().optional().describe("Filtrér på specifik ordre ID"),
  },
  async ({ module, order_id }) => toText(await client.order.listModule(module, order_id))
);

server.tool(
  "add_order_module",
  "Tilføjer en registrering til et ordre-modul, f.eks. tidsregistrering",
  {
    module: z.enum(order_module_names).describe("Modulnavn: timereg eller task"),
    data:   z.record(z.unknown()).describe("Data inkl. order_id og relevante felter"),
  },
  async ({ module, data }) => toText(await client.order.addModule(module, data))
);

// ─── Journal ─────────────────────────────────────────────────────────────────

server.tool(
  "list_journal",
  "Henter journal/chat beskeder for et specifikt objekt i et modul",
  {
    module:  z.enum(module_names).describe("Modulnavn, f.eks. 'bait', 'crm', 'genobj'"),
    item_id: z.number().describe("ID på objektet hvis journal skal hentes"),
  },
  async ({ module, item_id }) => {
    const filter = { [`module_${module}_item_id`]: `=${item_id}` };
    return toText(await client.object.list(`${module}:journal`, { filter }));
  }
);

server.tool(
  "add_journal",
  "Tilføjer en journal besked eller hændelse til et objekt i et modul",
  {
    module:  z.enum(module_names).describe("Modulnavn, f.eks. 'bait', 'crm', 'genobj'"),
    item_id: z.number().describe("ID på objektet der skal tilføjes journal til"),
    type:    z.enum(["text", "event"]).describe("'text' for besked, 'event' for hændelse med ikon"),
    log:     z.string().describe("Beskedtekst (type=text) eller kort hændelsestekst (type=event)"),
    icon:    z.string().optional().describe("Fontello ikon-navn, f.eks. 'icon-play', 'icon-pause' (kun ved type=event)"),
    color:   z.string().optional().describe("Hex farve på ikon, f.eks. '#3AA64C' (kun ved type=event)"),
  },
  async ({ module, item_id, type, log, icon, color }) => {
    const data = {
      [`module_${module}_item_id`]: item_id,
      type,
      log,
      ...(type === "event" && { icon, color }),
    };
    return toText(await client.object.create(`${module}:journal`, data));
  }
);

// ─── Relations ───────────────────────────────────────────────────────────────

server.tool(
  "list_relations",
  "Henter relationer mellem to moduler",
  {
    from_module: z.enum(module_names).describe("Kilde-modul"),
    to_module:   z.enum(module_names).describe("Mål-modul"),
    to_id:       z.number().describe("ID på mål-objektet"),
  },
  async ({ from_module, to_module, to_id }) =>
    toText(await client.object.listRelations(from_module, to_module, to_id))
);

// ─── Start ───────────────────────────────────────────────────────────────────

const transport = new StdioServerTransport();
await server.connect(transport);
