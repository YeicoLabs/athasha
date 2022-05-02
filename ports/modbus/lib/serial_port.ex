defmodule Modbus.Sport do
  def open(device, speed, config) do
    exec =
      case :os.type() do
        {:unix, :darwin} -> :code.priv_dir(:modbus) ++ '/dotnet/sport'
        {:unix, :linux} -> :code.priv_dir(:modbus) ++ '/dotnet/sport'
        {:win32, :nt} -> :code.priv_dir(:modbus) ++ '/dotnet/sport.exe'
      end

    args = [device, to_string(speed), config]
    opts = [:binary, :exit_status, packet: 2, args: args]
    port = Port.open({:spawn_executable, exec}, opts)
    {:ok, port}
  end

  def close(port) do
    true = Port.close(port)
    :ok
  end

  def read(port) do
    true = Port.command(port, ["r"])

    receive do
      {^port, {:exit_status, status}} -> {:error, {:exit, status}}
      {^port, {:data, data}} -> {:ok, data}
    end
  end

  def write(port, data) do
    true = Port.command(port, ["w", data])
    :ok
  end
end