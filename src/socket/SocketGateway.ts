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
  handleFold(@MessageBody() tableId) {
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

  @SubscribeMessage(CS_REBUY)
  handlerRebuy(@MessageBody() data: { tableId; seatId; amount }) {
    //
  }

  @SubscribeMessage(CS_STAND_UP)
  handlerStandUp(@MessageBody() tableId) {
    //
  }

  @SubscribeMessage(SITTING_OUT)
  handlerSittingOut(@MessageBody() data: { tableId; seatId }) {
    //
  }

  @SubscribeMessage(SITTING_IN)
  handlerSittingIn(@MessageBody() data: { tableId; seatId }) {
    //
  }

  @SubscribeMessage(CS_DISCONNECT)
  handlerDisconnect(@ConnectedSocket() socket: Socket) {
    //
  }

  getCurrentPlayers() {
    return Object.values(players).map((player: any) => {
      return {
        socketId: player.socketId,
        id: player.id,
        name: player.name,
      };
    });
  }

  getCurrentTables() {
    //   return Object.values(tables).map((table) => ({
    //     id: table.id,
    //     name: table.name,
    //     limit: table.limit,
    //     maxPlayers: table.maxPlayers,
    //     currentNumberPlayers: table.players.length,
    //     smallBlind: table.minBet,
    //     bigBlind: table.minBet * 2,
    //   }));
  }

  sitDown = (tableId, seatId, amount) => {
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

  updatePlayerBankroll(player, amount) {
    //   players[socket.id].bankroll += amount;
    //   io.to(socket.id).emit(SC_PLAYERS_UPDATED, getCurrentPlayers());
  }

  findSeatBySocketId(socketId) {
    //   let foundSeat = null;
    //   Object.values(tables).forEach((table) => {
    //     Object.values(table.seats).forEach((seat) => {
    //       if (seat && seat.player.socketId === socketId) {
    //         foundSeat = seat;
    //       }
    //     });
    //   });
    //   return foundSeat;
  }

  removeFromTables(socketId) {
    //   for (let i = 0; i < Object.keys(tables).length; i++) {
    //     tables[Object.keys(tables)[i]].removePlayer(socketId);
    //   }
  }

  broadcastToTable(table, message = null, from = null) {
    //   for (let i = 0; i < table.players.length; i++) {
    //     let socketId = table.players[i].socketId;
    //     let tableCopy = hideOpponentCards(table, socketId);
    //     io.to(socketId).emit(SC_TABLE_UPDATED, {
    //       table: tableCopy,
    //       message,
    //       from,
    //     });
    //   }
  }

  changeTurnAndBroadcast(table, seatId) {
    //   setTimeout(() => {
    //     table.changeTurn(seatId);
    //     broadcastToTable(table);
    //     if (table.handOver) {
    //       initNewHand(table);
    //     }
    //   }, 1000);
  }

  initNewHand(table) {
    //   if (table.activePlayers().length > 1) {
    //     broadcastToTable(table, '---New hand starting in 5 seconds---');
    //   }
    //   setTimeout(() => {
    //     table.clearWinMessages();
    //     table.startHand();
    //     broadcastToTable(table, '--- New hand started ---');
    //   }, 5000);
  }

  clearForOnePlayer(table) {
    //   table.clearWinMessages();
    //   setTimeout(() => {
    //     table.clearSeatHands();
    //     table.resetBoardAndPot();
    //     broadcastToTable(table, 'Waiting for more players');
    //   }, 5000);
  }

  hideOpponentCards(table, socketId) {
    //   let tableCopy = JSON.parse(JSON.stringify(table));
    //   let hiddenCard = { suit: 'hidden', rank: 'hidden' };
    //   let hiddenHand = [hiddenCard, hiddenCard];
    //   for (let i = 1; i <= tableCopy.maxPlayers; i++) {
    //     let seat = tableCopy.seats[i];
    //     if (
    //       seat &&
    //       seat.hand.length > 0 &&
    //       seat.player.socketId !== socketId &&
    //       !(seat.lastAction === WINNER && tableCopy.wentToShowdown)
    //     ) {
    //       seat.hand = hiddenHand;
    //     }
    //   }
    //   return tableCopy;
  }
}
