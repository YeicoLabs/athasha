defmodule Athasha.Auth do
  alias Athasha.License
  alias Athasha.Ports
  alias Athasha.Repo

  def licenses() do
    # works with openssl keys but not with ssh-keygen keys
    path = Path.join(:code.priv_dir(:athasha), "athasha.pub")
    pubkey = File.read!(path)
    pubsha1 = sha1(pubkey)
    [pubkey] = :public_key.pem_decode(pubkey)
    pubkey = :public_key.pem_entry_decode(pubkey)

    map =
      Repo.all(License)
      |> Enum.reduce(%{}, fn map, lic -> Map.put(map, lic.key, lic) end)

    id = identity()

    total =
      Enum.reduce(map, 0, fn count, {_, lic} ->
        msg = "#{lic.quantity}:#{lic.key}:#{id}"

        case :public_key.verify(msg, :sha512, lic.signature, pubkey) do
          true -> count + lic.quantity
          false -> count
        end
      end)

    case pubsha1 do
      "c145f9acb4f5b462bbcef81e70feeeea01518876" -> total
      _ -> 0
    end
  end

  def password() do
    ""
  end

  def login(_token, _proof, nil), do: false

  def login(token, proof, password) do
    proof == sha1("#{token}:#{password}")
  end

  def sha1(data) do
    :crypto.hash(:sha, data) |> Base.encode16() |> String.downcase()
  end

  def identity() do
    [line] = Ports.read_lines("identity")
    line
  end
end