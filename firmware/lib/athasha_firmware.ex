defmodule AthashaFirmware do
  def chvt(tn) do
    exec = :code.priv_dir(:athasha_firmware) ++ '/native/tty_chvt'
    System.cmd("#{exec}", ["#{tn}"])
  end

  def target() do
    Application.get_env(:athasha_firmware, :target)
  end

  def exit() do
    # exit from nerves shell (works in host as well)
    Process.exit(Process.group_leader(), :kill)
  end
end