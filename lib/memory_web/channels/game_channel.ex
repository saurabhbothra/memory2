#Attribution : Referred to Nat Tuck's hangman example and learnt the flow and then implemented on my own.

defmodule MemoryWeb.GameChannel do
use MemoryWeb, :channel
alias Memory.Game
alias Memory.BackupAgent

def join("game:" <> gameName, payload, socket) do
   if authorized?(payload) do
      game = BackupAgent.get(gameName) || Game.new()
      BackupAgent.put(gameName, game)
      socket = socket
          |> assign(:game, game)
          |> assign(:gameName, gameName)
      BackupAgent.put(gameName, game)
      {:ok, %{"join" => gameName, "game" => Game.client_view(game)}, socket}
   else
      {:error, %{reason: "unauthorized"}}
   end
end


def handle_in("check_validity", %{"i" => i}, socket) do
    gameName = socket.assigns[:gameName]
    game = Game.check_validity(socket.assigns[:game], i)
    socket = assign(socket, :game, game)
    BackupAgent.put(gameName, game)
    {:reply, {:ok, %{"game" => Game.client_view(game)}}, socket}
end

def handle_in("first_button_clicked", %{"i" => i}, socket) do
    gameName = socket.assigns[:gameName]
    game = Game.firstButtonClicked(socket.assigns[:game], i)
    socket = assign(socket, :game, game)
    BackupAgent.put(gameName, game)
    {:reply, {:ok, %{"game" => Game.client_view(game)}}, socket}
end

def handle_in("disable_continue_game", %{"i" => i}, socket) do
    gameName = socket.assigns[:gameName]
    game = Game.disableContinue(socket.assigns[:game], i)
    socket = assign(socket, :game, game)
    BackupAgent.put(gameName, game)
    {:reply, {:ok, %{"game" => Game.client_view(game)}}, socket}
end

def handle_in("buttons_matched", %{"i" => i}, socket) do
    gameName = socket.assigns[:gameName]
    game = Game.buttonsMatched(socket.assigns[:game], i)
    socket = assign(socket, :game, game)
    BackupAgent.put(gameName, game)
    {:reply, {:ok, %{"game" => Game.client_view(game)}}, socket}
end

def handle_in("buttons_not_matched", %{"i" => i}, socket) do
    gameName = socket.assigns[:gameName]
    game = Game.buttonsNotMatched(socket.assigns[:game], i)
    socket = assign(socket, :game, game)
    BackupAgent.put(gameName, game)
    {:reply, {:ok, %{"game" => Game.client_view(game)}}, socket}
end

def handle_in("reset", %{}, socket) do
    gameName = socket.assigns[:gameName]
    game = Game.reset(socket.assigns[:game])
    socket = assign(socket, :game, game)
    BackupAgent.put(gameName, game)
    {:reply, {:ok, %{"game" => Game.client_view(game)}}, socket}
end

defp authorized?( _payload ) do
	true
end

end
