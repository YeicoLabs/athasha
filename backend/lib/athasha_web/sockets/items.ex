defmodule AthashaWeb.ItemsSocket do
  @behaviour Phoenix.Socket.Transport
  @ping 5000
  alias Athasha.Bus
  alias Athasha.Auth
  alias Athasha.Server
  alias Athasha.Globals

  def child_spec(_opts) do
    %{id: __MODULE__, start: {Task, :start_link, [fn -> :ok end]}, restart: :transient}
  end

  def connect(_state) do
    {:ok, %{logged: false}}
  end

  def init(state) do
    Process.send_after(self(), :ping, @ping)
    {:ok, state}
  end

  def terminate(_reason, _state) do
    :ok
  end

  def handle_info(:ping, state) do
    resp = %{name: "ping"}
    reply_text(resp, state)
  end

  def handle_info({:status, nil, status}, state) do
    resp = %{name: "status", args: status}
    reply_text(resp, state)
  end

  def handle_info(:logged, state) do
    Bus.register!(:items, nil)
    Bus.register!(:status, nil)
    all = Server.all()
    state = Map.put(state, :version, all.version)
    identity = Globals.find_identity()
    licenses = Globals.find_licenses()
    hostname = Globals.find_hostname()
    ips = Globals.find_ips()

    args = %{
      items: all.items,
      identity: identity,
      licenses: licenses,
      hostname: hostname,
      ips: ips
    }

    resp = %{name: "all", args: args}
    reply_text(resp, state)
  end

  def handle_info({:items, nil, {:init, _all}}, state) do
    {:stop, :init, state}
  end

  def handle_info({:items, nil, {from, version, muta}}, state) do
    case state.version + 1 do
      ^version ->
        args = muta.args
        muta = Map.put(muta, :version, version)
        muta = Map.put(muta, :self, from == self())
        muta = Map.put(muta, :args, args)
        state = Map.put(state, :version, version)
        reply_text(muta, state)

      _ ->
        {:ok, state}
    end
  end

  def handle_in({text, _opts}, state) do
    event = Jason.decode!(text)
    handle_event(event, state)
  end

  defp handle_event(%{"name" => "pong"}, state) do
    Process.send_after(self(), :ping, @ping)
    {:ok, state}
  end

  defp handle_event(event = %{"name" => "login"}, state = %{logged: false}) do
    args = event["args"]
    session = args["session"]
    password = Auth.password()

    case Auth.login(session["token"], session["proof"], password) do
      true ->
        Process.send_after(self(), :logged, 0)
        state = Map.put(state, :logged, true)
        resp = %{name: "session", args: session}
        reply_text(resp, state)

      false ->
        resp = %{name: "login", args: args["active"]}
        reply_text(resp, state)
    end
  end

  defp handle_event(event = %{"name" => "restore"}, state = %{logged: true}) do
    name = event["name"]

    args =
      Enum.map(event["args"], fn item ->
        %{
          id: item["id"],
          name: item["name"],
          type: item["type"],
          enabled: item["enabled"],
          config: item["config"]
        }
      end)

    Server.apply(%{name: name, args: args})

    {:ok, state}
  end

  defp handle_event(event, state = %{logged: true}) do
    name = event["name"]
    args = event["args"]

    event =
      case name do
        "rename" ->
          %{name: "rename", args: %{id: args["id"], name: args["name"]}}

        "enable" ->
          %{name: "enable", args: %{id: args["id"], enabled: args["enabled"]}}

        "edit" ->
          %{name: "edit", args: %{id: args["id"], config: args["config"]}}

        "delete" ->
          %{name: "delete", args: %{id: args["id"]}}

        "create" ->
          %{
            name: "create",
            args: %{
              name: args["name"],
              type: args["type"],
              enabled: args["enabled"],
              config: args["config"]
            }
          }
      end

    # ignore event collision (do not check :ok =)
    Server.apply(event)

    {:ok, state}
  end

  defp reply_text(resp, state) do
    json = Jason.encode!(resp)
    {:reply, :ok, {:text, json}, state}
  end
end
