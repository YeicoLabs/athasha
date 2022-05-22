defmodule Athasha.Number do
  def calibrator(factor, offset) do
    fn value -> calibrate(value, factor, offset) end
  end

  def calibrate(value, 1.0, 0.0), do: value
  def calibrate(value, factor, offset), do: to_float(value) * factor + offset

  def trimmer(decimals) do
    fn value -> trim(value, decimals) end
  end

  # the goal of trim is to ensure visual stability
  # Float.round may return 1.2 which may display 1.199...
  def trim(value, _decimals) when is_integer(value), do: value

  def trim(value, decimals) when is_float(value) do
    Decimal.from_float(value) |> Decimal.round(decimals)
  end

  def trim(value, decimals) when is_struct(value, Decimal) do
    Decimal.round(value, decimals)
  end

  def to_float(value) when is_float(value), do: value
  def to_float(value) when is_integer(value), do: :erlang.float(value)
  def to_float(value) when is_struct(value, Decimal), do: Decimal.to_float(value)

  def to_integer(value) when is_integer(value), do: value
  def to_integer(value) when is_float(value), do: round(value)
  def to_integer(value) when is_struct(value, Decimal), do: round(Decimal.to_float(value))

  def to_uint16(value) when value > 65535, do: 65535
  def to_uint16(value) when value < 0, do: 0
  def to_uint16(value), do: value

  def to_sint16(value) when value > 32767, do: 32767
  def to_sint16(value) when value < -32768, do: -32768
  def to_sint16(value), do: value

  def to_bit(0), do: 0
  def to_bit(0.0), do: 0
  def to_bit(value) when is_struct(value, Decimal), do: to_bit(value.coef)
  def to_bit(_), do: 1

  def r_u16be(w16) do
    <<value::unsigned-integer-big-16>> = <<w16::16>>
    value
  end

  def r_s16be(w16) do
    <<value::signed-integer-big-16>> = <<w16::16>>
    value
  end

  def r_u16le(w16) do
    <<value::unsigned-integer-little-16>> = <<w16::16>>
    value
  end

  def r_s16le(w16) do
    <<value::signed-integer-little-16>> = <<w16::16>>
    value
  end

  def r_f32bed([w0, w1]) do
    <<value::float-big-32>> = <<w0::16, w1::16>>
    value
  end

  def r_f32led([w0, w1]) do
    <<value::float-little-32>> = <<w0::16, w1::16>>
    value
  end

  def r_f32ber([w0, w1]) do
    <<value::float-big-32>> = <<w1::16, w0::16>>
    value
  end

  def r_f32ler([w0, w1]) do
    <<value::float-little-32>> = <<w1::16, w0::16>>
    value
  end

  def w_u16be(value) do
    value = to_integer(value) |> to_uint16()
    <<w16::16>> = <<value::unsigned-integer-big-16>>
    w16
  end

  def w_s16be(value) do
    value = to_integer(value) |> to_sint16()
    <<w16::16>> = <<value::signed-integer-big-16>>
    w16
  end

  def w_u16le(value) do
    value = to_integer(value) |> to_uint16()
    <<w16::16>> = <<value::unsigned-integer-little-16>>
    w16
  end

  def w_s16le(value) do
    value = to_integer(value) |> to_sint16()
    <<w16::16>> = <<value::signed-integer-little-16>>
    w16
  end

  def w_f32bed(value) do
    value = to_float(value)
    <<w0::16, w1::16>> = <<value::float-big-32>>
    [w0, w1]
  end

  def w_f32led(value) do
    value = to_float(value)
    <<w0::16, w1::16>> = <<value::float-little-32>>
    [w0, w1]
  end

  def w_f32ber(value) do
    value = to_float(value)
    <<w1::16, w0::16>> = <<value::float-big-32>>
    [w0, w1]
  end

  def w_f32ler(value) do
    value = to_float(value)
    <<w1::16, w0::16>> = <<value::float-little-32>>
    [w0, w1]
  end
end