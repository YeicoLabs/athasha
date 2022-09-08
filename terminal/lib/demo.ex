defmodule Terminal.Demo do
  use Terminal.App
  alias Terminal.Panel
  alias Terminal.Label
  alias Terminal.Button
  alias Terminal.Frame
  alias Terminal.Select

  def init(opts) do
    size = Keyword.fetch!(opts, :size)
    app_init(&counter/2, size: size)
  end

  def counter(react, %{size: size}) do
    {count, set_count} = use_state(react, :count, 0)

    increment = fn -> set_count.(count + 1) end
    decrement = fn -> set_count.(count - 1) end

    markup :panel, Panel, size: size do
      markup(:label, Label, origin: {0, 0}, size: {12, 1}, text: "#{count}")

      markup(:inc, Button,
        origin: {0, 1},
        size: {12, 1},
        enabled: rem(count, 3) != 2,
        text: "Increment",
        on_click: increment
      )

      markup(:dec, Button,
        origin: {0, 2},
        size: {12, 1},
        text: "Decrement",
        enabled: rem(count, 3) != 0,
        on_click: decrement
      )

      markup(:frame, Frame,
        origin: {0, 3},
        size: {12, 5},
        text: "Frame"
      )

      markup(:select, Select,
        origin: {1, 4},
        size: {10, 3},
        items: ["Item1", "Item2"]
      )
    end
  end
end
