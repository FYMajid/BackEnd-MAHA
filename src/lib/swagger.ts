type HttpMethod = "get" | "post" | "put" | "delete";

interface RouteDef {
  method: HttpMethod;
  path: string;
  summary?: string;
  requestBody?: boolean;
  query?: string[];
  public?: boolean;
}

interface ResourceDef {
  basePath: string;
  routes: RouteDef[];
}

const resources: ResourceDef[] = [
  {
    basePath: "/api/users",
    routes: [
      { method: "post", path: "/register", public: true },
      { method: "post", path: "/login", public: true },
      { method: "get", path: "/", query: ["organizationId"] },
      { method: "get", path: "/:id" },
      { method: "put", path: "/:id" },
      { method: "delete", path: "/:id", requestBody: false },
    ],
  },
  {
    basePath: "/api/auth",
    routes: [
      { method: "post", path: "/refresh", public: true },
      { method: "post", path: "/logout", public: true },
    ],
  },
  {
    basePath: "/api/organizations",
    routes: [
      { method: "post", path: "/" },
      { method: "get", path: "/" },
      { method: "get", path: "/:id" },
      { method: "put", path: "/:id" },
      { method: "delete", path: "/:id", requestBody: false },
    ],
  },
  {
    basePath: "/api/roles",
    routes: [
      { method: "post", path: "/" },
      { method: "get", path: "/" },
      { method: "get", path: "/:id" },
      { method: "put", path: "/:id" },
      { method: "delete", path: "/:id", requestBody: false },
    ],
  },
  {
    basePath: "/api/permissions",
    routes: [
      { method: "post", path: "/" },
      { method: "get", path: "/" },
      { method: "get", path: "/:id" },
      { method: "put", path: "/:id" },
      { method: "delete", path: "/:id", requestBody: false },
    ],
  },
  {
    basePath: "/api/user-roles",
    routes: [
      { method: "post", path: "/" },
      { method: "get", path: "/" },
      { method: "get", path: "/:userId/:roleId" },
      { method: "delete", path: "/:userId/:roleId", requestBody: false },
    ],
  },
  {
    basePath: "/api/role-permissions",
    routes: [
      { method: "post", path: "/" },
      { method: "get", path: "/" },
      { method: "get", path: "/:roleId/:permissionId" },
      { method: "delete", path: "/:roleId/:permissionId", requestBody: false },
    ],
  },
  {
    basePath: "/api/sessions",
    routes: [
      { method: "post", path: "/" },
      { method: "get", path: "/" },
      { method: "get", path: "/:id" },
      { method: "put", path: "/:id" },
      { method: "delete", path: "/:id", requestBody: false },
    ],
  },
  {
    basePath: "/api/login-logs",
    routes: [
      { method: "post", path: "/" },
      { method: "get", path: "/" },
      { method: "get", path: "/:id" },
      { method: "put", path: "/:id" },
      { method: "delete", path: "/:id", requestBody: false },
    ],
  },
  {
    basePath: "/api/contact-types",
    routes: [
      { method: "post", path: "/" },
      { method: "get", path: "/" },
      { method: "get", path: "/:id" },
      { method: "put", path: "/:id" },
      { method: "delete", path: "/:id", requestBody: false },
    ],
  },
  {
    basePath: "/api/contacts",
    routes: [
      { method: "post", path: "/" },
      { method: "get", path: "/" },
      { method: "get", path: "/:id" },
      { method: "put", path: "/:id" },
      { method: "delete", path: "/:id", requestBody: false },
    ],
  },
  {
    basePath: "/api/contact-details",
    routes: [
      { method: "post", path: "/" },
      { method: "get", path: "/:contactId" },
      { method: "put", path: "/:contactId" },
      { method: "delete", path: "/:contactId", requestBody: false },
    ],
  },
  {
    basePath: "/api/matters",
    routes: [
      { method: "post", path: "/" },
      { method: "get", path: "/" },
      { method: "get", path: "/:id" },
      { method: "put", path: "/:id" },
      { method: "delete", path: "/:id", requestBody: false },
    ],
  },
  {
    basePath: "/api/matter-members",
    routes: [
      { method: "post", path: "/" },
      { method: "get", path: "/" },
      { method: "get", path: "/:matterId/:userId" },
      { method: "put", path: "/:matterId/:userId" },
      { method: "delete", path: "/:matterId/:userId", requestBody: false },
    ],
  },
  {
    basePath: "/api/matter-parties",
    routes: [
      { method: "post", path: "/" },
      { method: "get", path: "/" },
      { method: "get", path: "/:matterId/:contactId" },
      { method: "put", path: "/:matterId/:contactId" },
      { method: "delete", path: "/:matterId/:contactId", requestBody: false },
    ],
  },
  {
    basePath: "/api/tasks",
    routes: [
      { method: "post", path: "/" },
      { method: "get", path: "/" },
      { method: "get", path: "/:id" },
      { method: "put", path: "/:id" },
      { method: "delete", path: "/:id", requestBody: false },
    ],
  },
  {
    basePath: "/api/calendar-events",
    routes: [
      { method: "post", path: "/" },
      { method: "get", path: "/" },
      { method: "get", path: "/:id" },
      { method: "put", path: "/:id" },
      { method: "delete", path: "/:id", requestBody: false },
    ],
  },
  {
    basePath: "/api/documents",
    routes: [
      { method: "post", path: "/" },
      { method: "get", path: "/" },
      { method: "get", path: "/:id" },
      { method: "put", path: "/:id" },
      { method: "delete", path: "/:id", requestBody: false },
    ],
  },
  {
    basePath: "/api/document-versions",
    routes: [
      { method: "post", path: "/" },
      { method: "get", path: "/" },
      { method: "get", path: "/:id" },
      { method: "put", path: "/:id" },
      { method: "delete", path: "/:id", requestBody: false },
    ],
  },
  {
    basePath: "/api/time-entries",
    routes: [
      { method: "post", path: "/" },
      { method: "get", path: "/" },
      { method: "get", path: "/:id" },
      { method: "put", path: "/:id" },
      { method: "delete", path: "/:id", requestBody: false },
    ],
  },
  {
    basePath: "/api/expenses",
    routes: [
      { method: "post", path: "/" },
      { method: "get", path: "/" },
      { method: "get", path: "/:id" },
      { method: "put", path: "/:id" },
      { method: "delete", path: "/:id", requestBody: false },
    ],
  },
  {
    basePath: "/api/invoices",
    routes: [
      { method: "post", path: "/" },
      { method: "get", path: "/" },
      { method: "get", path: "/:id" },
      { method: "put", path: "/:id" },
      { method: "delete", path: "/:id", requestBody: false },
    ],
  },
  {
    basePath: "/api/invoice-items",
    routes: [
      { method: "post", path: "/" },
      { method: "get", path: "/" },
      { method: "get", path: "/:id" },
      { method: "put", path: "/:id" },
      { method: "delete", path: "/:id", requestBody: false },
    ],
  },
  {
    basePath: "/api/payments",
    routes: [
      { method: "post", path: "/" },
      { method: "get", path: "/" },
      { method: "get", path: "/:id" },
      { method: "put", path: "/:id" },
      { method: "delete", path: "/:id", requestBody: false },
    ],
  },
  {
    basePath: "/api/bank-accounts",
    routes: [
      { method: "post", path: "/" },
      { method: "get", path: "/" },
      { method: "get", path: "/:id" },
      { method: "put", path: "/:id" },
      { method: "delete", path: "/:id", requestBody: false },
    ],
  },
  {
    basePath: "/api/activity-logs",
    routes: [
      { method: "post", path: "/" },
      { method: "get", path: "/" },
      { method: "get", path: "/:id" },
      { method: "put", path: "/:id" },
      { method: "delete", path: "/:id", requestBody: false },
    ],
  },
  {
    basePath: "/api/notifications",
    routes: [
      { method: "post", path: "/" },
      { method: "get", path: "/" },
      { method: "get", path: "/:id" },
      { method: "put", path: "/:id" },
      { method: "delete", path: "/:id", requestBody: false },
    ],
  },
];

const toSwaggerPath = (path: string) =>
  path.replace(/:([A-Za-z0-9_]+)/g, "{$1}");

const buildResponses = (method: HttpMethod) => {
  if (method === "delete") {
    return { "204": { description: "No Content" } };
  }
  const status = method === "post" ? "201" : "200";
  return {
    [status]: {
      description: status === "201" ? "Created" : "OK",
      content: {
        "application/json": {
          schema: { type: "object", additionalProperties: true },
        },
      },
    },
  };
};

const buildParameters = (path: string, query?: string[]) => {
  const params: Array<Record<string, unknown>> = [];
  const pathParams = Array.from(path.matchAll(/\{(\w+)\}/g)).map(
    (match) => match[1],
  );

  pathParams.forEach((name) => {
    params.push({
      name,
      in: "path",
      required: true,
      schema: { type: "string" },
    });
  });

  if (query?.length) {
    query.forEach((name) => {
      params.push({
        name,
        in: "query",
        required: false,
        schema: { type: "string" },
      });
    });
  }

  return params;
};

const tags = Array.from(
  new Set(resources.map((resource) => resource.basePath.replace("/api/", ""))),
).map((name) => ({ name }));

const paths: Record<string, Record<string, unknown>> = {};

resources.forEach((resource) => {
  const tag = resource.basePath.replace("/api/", "");
  resource.routes.forEach((route) => {
    const fullPath = toSwaggerPath(`${resource.basePath}${route.path}`);
    const method = route.method;
    const parameters = buildParameters(fullPath, route.query);

    const operation: Record<string, unknown> = {
      tags: [tag],
      summary: route.summary ?? `${method.toUpperCase()} ${fullPath}`,
      responses: buildResponses(method),
    };

    if (parameters.length) {
      operation.parameters = parameters;
    }

    if (method !== "get" && method !== "delete" && route.requestBody !== false) {
      operation.requestBody = {
        required: method === "post" || method === "put",
        content: {
          "application/json": {
            schema: { type: "object", additionalProperties: true },
          },
        },
      };
    }

    if (route.public) {
      operation.security = [];
    }

    if (!paths[fullPath]) {
      paths[fullPath] = {};
    }
    paths[fullPath][method] = operation;
  });
});

export const swaggerSpec = {
  openapi: "3.0.0",
  info: {
    title: "MAHA API",
    version: "1.0.0",
    description: "Swagger docs for MAHA backend",
  },
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
  },
  security: [{ bearerAuth: [] }],
  servers: [
    {
      url: "/",
    },
  ],
  tags,
  paths,
};
