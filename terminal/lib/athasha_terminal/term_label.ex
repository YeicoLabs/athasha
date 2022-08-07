defmodule AthashaTerminal.Label do
  @behaviour AthashaTerminal.Window
  alias AthashaTerminal.Canvas
  alias AthashaTerminal.Theme

  def init(opts) do
    text = Keyword.get(opts, :text, "")
    theme = Keyword.get(opts, :theme, Theme.get())
    origin = Keyword.get(opts, :origin, {0, 0})
    size = Keyword.get(opts, :size, {String.length(text), 1})
    bgcolor = Keyword.get(opts, :bgcolor, theme.back_readonly)
    fgcolor = Keyword.get(opts, :fgcolor, theme.fore_readonly)

    %{
      text: text,
      size: size,
      origin: origin,
      bgcolor: bgcolor,
      fgcolor: fgcolor
    }
  end

  def bounds(%{origin: {x, y}, size: {w, h}}), do: {x, y, w, h}
  def update(state, name, value), do: Map.put(state, name, value)

  def render(state, canvas) do
    %{
      text: text,
      size: {w, _h},
      bgcolor: bgcolor,
      fgcolor: fgcolor
    } = state

    text = String.pad_trailing(text, w)
    canvas = Canvas.color(canvas, :bgcolor, bgcolor)
    canvas = Canvas.color(canvas, :fgcolor, fgcolor)
    canvas = Canvas.move(canvas, 0, 0)
    Canvas.write(canvas, text)
  end
end
