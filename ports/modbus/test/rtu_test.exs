defmodule Modbus.RtuTest do
  use ExUnit.Case
  alias Modbus.Rtu

  test "wrap test" do
    p(<<0xCB, 0x4F>>, <<0x01, 0x05, 0x0B, 0xB8, 0x00, 0x00>>)
    p(<<0x3B, 0x0E>>, <<0x01, 0x05, 0x0B, 0xB8, 0xFF, 0x00>>)
    p(<<0xCB, 0x7F>>, <<0x01, 0x01, 0x0B, 0xB8, 0x00, 0x01>>)
    p(<<0x88, 0x51>>, <<0x01, 0x01, 0x01, 0x00>>)
  end

  defp p(<<crc_hi, crc_lo>>, payload) do
    assert <<payload::binary, crc_lo, crc_hi>> == payload |> Rtu.Protocol.Wrapper.wrap()
    assert payload == <<payload::binary, crc_lo, crc_hi>> |> Rtu.Protocol.Wrapper.unwrap()
  end
end