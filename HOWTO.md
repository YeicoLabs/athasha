# HOWTO

```bash
mkdir backend
cd backend
mix phx.new . --app athasha --database sqlite3 --live
mix deps.get
mix ecto.create
mix phx.server
iex -S mix phx.server
#config contains a json with bus and points settings
mix phx.gen.schema Session sessions origin:string
mix phx.gen.schema Item items name:string type:string version:integer enabled:boolean config:string
mix ecto.drop
mix ecto.migrate

sudo npm -g install yarn
brew install yarn
npx create-react-app frontend
cd frontend
yarn start
#http://localhost:3000/
yarn test
yarn add bootstrap react-bootstrap
yarn add http-proxy-middleware

#code editor from https://github.com/YeicoLabs/tryout01_athasha
#file browser from https://github.com/YeicoLabs/tryout01_athasha
#auth context from https://github.com/YeicoLabs/tryout02_athasha
#socket pubsub from https://github.com/YeicoLabs/tryout05_athasha
```

## Development

- Initial empty password for quick login

## Strategy

- Avoid abstraction jail
- Single concurrent user UI: rest instead of websocket
- Single super user role: single password to manage

## Authentication

- Auth over websocket?
- Single super user
- Secure even over HTTP
- GET /logout?sid=SID
- GET /login?rt=UUID&et=XYZ...
  - rt: raw token cannot be reused ever
  - et: oneway password encrypted token
  - disables any other session
  - return session id
- Change password thru localhost ssh app
- Exported items have their own login system

## Architecture

- IO Server
  - Grouped by device
  - A custom IO server (OPC)
  - API (change and read event)
- Data Loggers, Web Views, DB Links
  - Connect to io-server API
- Serial Terminal, Modbus Terminal, ...
- Scripts

## Use Cases

- Laurel Monitor
  - No buttons
  - Web viewer
  - Data recording
  - Alarms
- Modbus Monitor
  - Digital or analog
  - Widget

## Research

- Installer
- Auth2
- License
- Setup (TCP ports, ...)
- HTTPS

## Refereces

- https://kentcdodds.com/blog/how-to-use-react-context-effectively
- https://gist.github.com/mjackson/d54b40a094277b7afdd6b81f51a0393f
- https://furlough.merecomplexities.com/elixir/phoenix/tutorial/2021/02/19/binary-websockets-with-elixir-phoenix.html
- http://saule1508.github.io/create-react-app-proxy-websocket/
- https://gist.github.com/htp/fbce19069187ec1cc486b594104f01d0
- https://createreactapp.github.io/proxying-api-request

```bash
curl --include \
     --no-buffer \
     --header "Connection: Upgrade" \
     --header "Upgrade: websocket" \
     --header "Host: localhost:4000" \
     --header "Origin: localhost:4000" \
     --header "Sec-WebSocket-Key: SGVsbG8sIHdvcmxkIQ==" \
     --header "Sec-WebSocket-Version: 13" \
     http://localhost:4000/items/websocket
```

```elixir
%{
  connect_info: %{},
  endpoint: AthashaWeb.Endpoint,
  options: [
    path: "/websocket",
    serializer: [
      {Phoenix.Socket.V1.JSONSerializer, "~> 1.0.0"},
      {Phoenix.Socket.V2.JSONSerializer, "~> 2.0.0"}
    ],
    error_handler: {Phoenix.Transports.WebSocket, :handle_error, []},
    timeout: 60000,
    transport_log: false,
    compress: false
  ],
  params: %{},
  transport: :websocket
}
```