import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { config } from 'src/config';
import {
  CS_FETCH_LOBBY_INFO,
  SC_RECEIVE_LOBBY_INFO,
  SC_PLAYERS_UPDATED,
  CS_JOIN_TABLE,
  SC_TABLE_JOINED,
  SC_TABLES_UPDATED,
  CS_LEAVE_TABLE,
  SC_TABLE_LEFT,
  CS_FOLD,
  CS_CHECK,
  CS_CALL,
  CS_RAISE,
  TABLE_MESSAGE,
  CS_SIT_DOWN,
  CS_REBUY,
  CS_STAND_UP,
  SITTING_OUT,
  SITTING_IN,
  CS_DISCONNECT,
  SC_TABLE_UPDATED,
  WINNER,
  CS_LOBBY_CONNECT,
  CS_LOBBY_DISCONNECT,
  SC_LOBBY_CONNECTED,
  SC_LOBBY_DISCONNECTED,
  SC_LOBBY_CHAT,
  CS_LOBBY_CHAT,
} from 'src/game/Actions';
import { Player } from 'src/game/Player';
import { Table } from 'src/game/Table';

const tables = {
  1: new Table(1, 'Table 1', config.INITIAL_CHIPS_AMOUNT),
};
const players = {};

function getCurrentPlayers() {
  return Object.values(players).map((player: any) => {
    return {
      socketId: player.socketId,
      id: player.id,
      name: player.name,
    };
  });
}

function getCurrentTables() {
  return Object.values(tables).map((table) => ({
    id: table.id,
    name: table.name,
    limit: table.limit,
    maxPlayers: table.maxPlayers,
    currentNumberPlayers: table.players.length,
    smallBlind: table.minBet,
    bigBlind: table.minBet * 2,
  }));
}

const sitDown = (tableId, seatId, amount) => {
  // const table = tables[tableId];
  // const player = players[socket.id];
  // if (player) {
  //   table.sitPlayer(player, seatId, amount);
  //   let message = `${player.name} sat down in Seat ${seatId}`;
  //   updatePlayerBankroll(player, -amount);
  //   broadcastToTable(table, message);
  //   if (table.activePlayers().length === 2) {
  //     initNewHand(table);
  //   }
  // }
};

// TODO: Check what port client is expecting connection to
@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class SocketGateway {
  @WebSocketServer()
  server: Server;

  constructor() {}

  @SubscribeMessage(CS_LOBBY_CONNECT)
  handleConnect(
    @MessageBody() data: { gameId: string; address: string; userInfo },
  ) {
    //
  }

  @SubscribeMessage(CS_LOBBY_DISCONNECT)
  handleDisconnect(
    @MessageBody() data: { gameId: string; address: string; userInfo },
  ) {
    //
  }

  @SubscribeMessage(CS_LOBBY_CHAT)
  handleChat(
    @MessageBody() data: { gameId: string; address: string; userInfo },
  ) {
    //
  }

  @SubscribeMessage(CS_FETCH_LOBBY_INFO)
  handleGetLobbyInfo(
    @MessageBody() data: { walletAddress; socketId; gameId; username },
  ) {
    //
  }

  @SubscribeMessage(CS_JOIN_TABLE)
  handleJoinTable(@MessageBody() tableId) {
    //
  }

  @SubscribeMessage(CS_LEAVE_TABLE)
  handleLeaveTable(@MessageBody() tableId) {
    //
  }

  @SubscribeMessage(CS_FOLD)
  handleFold(@MessageBody() tableId, @ConnectedSocket() client: Socket) {
    //
  }

  @SubscribeMessage(CS_CHECK)
  handleCheck(@MessageBody() tableId) {
    //
  }

  @SubscribeMessage(CS_CALL)
  handleCall(@MessageBody() tableId) {
    //
  }

  @SubscribeMessage(CS_CALL)
  handlerRaise(@MessageBody() data: { tableId; amount }) {
    //
  }

  @SubscribeMessage(TABLE_MESSAGE)
  handlerTableMessage(@MessageBody() data: { message; from; tableId }) {
    //
  }
}
