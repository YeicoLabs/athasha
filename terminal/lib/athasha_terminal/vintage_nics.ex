defmodule AthashaTerminal.VintageNics do
  @eth0 "eth0"
  @wlan0 "wlan0"

  def init(opts) do
    focus = Keyword.fetch!(opts, :focus)

    nics = [@eth0, @wlan0]
    next = %{nil => @eth0, @wlan0 => @eth0, @eth0 => @wlan0}
    prev = %{nil => @wlan0, @wlan0 => @eth0, @eth0 => @wlan0}

    state = %{
      focus: focus,
      nics: nics,
      next: next,
      prev: prev,
      nic: @eth0
    }

    {state, @eth0}
  end

  def update(state, {:focus, focus}) do
    state = %{state | focus: focus}
    {state, nil}
  end

  def update(%{focus: true} = state, {:key, _, :arrow_down}) do
    %{next: next, nic: nic} = state
    nic = Map.get(next, nic)
    state = %{state | nic: nic}
    {state, nil}
  end

  def update(%{focus: true} = state, {:key, _, :arrow_up}) do
    %{prev: prev, nic: nic} = state
    nic = Map.get(prev, nic)
    state = %{state | nic: nic}
    {state, nil}
  end

  def update(%{focus: true} = state, {:key, _, "\t"}) do
    {state, {:nav, :next}}
  end

  def update(%{focus: true} = state, {:key, _, "\r"}) do
    %{nic: nic} = state
    {state, {:nic, nic}}
  end

  def update(state, _event), do: {state, nil}

  def render(state, size: size, origin: origin) do
    {width, height} = size
    {originx, originy} = origin

    %{
      focus: focus,
      nics: nics,
      nic: nic
    } = state

    nics_window = %{
      type: :window,
      x: originx,
      y: originy,
      width: width,
      height: height,
      background: :black,
      foreground: :white,
      border: if(focus, do: :double, else: :single),
      title: "NICs"
    }

    nics_labels =
      for {n, i} <- Enum.with_index(nics) do
        %{
          type: :label,
          x: originx + 2,
          y: originy + 1 + i,
          width: width - 4,
          background: :black,
          foreground: :white,
          inverse: nic == n,
          text: n
        }
      end

    [nics_window] ++ nics_labels
  end
end