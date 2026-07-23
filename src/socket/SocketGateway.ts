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
import { Seat } from 'src/game/Seat';
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
  io: Server;

  constructor() {}

  @SubscribeMessage(CS_LOBBY_CONNECT)
  handleConnect(
    @MessageBody() data: { gameId: string; address: string; userInfo },
    @ConnectedSocket() socket: Socket,
  ) {
    this.io.to(data.gameId).emit(SC_LOBBY_CONNECTED, {
      address: data.address,
      userInfo: data.userInfo,
    });
    console.log(SC_LOBBY_CONNECTED, data.address, socket.id);
  }

  @SubscribeMessage(CS_LOBBY_DISCONNECT)
  handleDisconnect(
    @MessageBody() data: { gameId: string; address: string; userInfo },
    @ConnectedSocket() socket: Socket,
  ) {
    this.io.to(data.gameId).emit(SC_LOBBY_DISCONNECTED, {
      address: data.address,
      userInfo: data.userInfo,
    });
    console.log(CS_LOBBY_DISCONNECT, data.address, socket.id);
  }

  @SubscribeMessage(CS_LOBBY_CHAT)
  handleChat(@MessageBody() data: { gameId: string; text: string; userInfo }) {
    this.io
      .to(data.gameId)
      .emit(SC_LOBBY_CHAT, { text: data.text, userInfo: data.userInfo });
  }

  @SubscribeMessage(CS_FETCH_LOBBY_INFO)
  handleGetLobbyInfo(
    @MessageBody()
    data: {
      walletAddress: string;
      socketId: string;
      gameId;
      username: string;
    },
    @ConnectedSocket() socket: Socket,
  ) {
    const found: Player = Object.values<any>(players).find((player) => {
      return player.id == data.walletAddress;
    });

    if (found) {
      delete players[found.socketId];
      Object.values(tables).map((table) => {
        table.removePlayer(found.socketId);
        this.broadcastToTable(table);
      });
    }

    players[data.socketId] = new Player(
      data.socketId,
      data.walletAddress,
      data.username,
      config.INITIAL_CHIPS_AMOUNT,
    );
    socket.emit(SC_RECEIVE_LOBBY_INFO, {
      tables: this.getCurrentTables(),
      players: this.getCurrentPlayers(),
      socketId: socket.id,
      amount: config.INITIAL_CHIPS_AMOUNT,
    });
    socket.broadcast.emit(SC_PLAYERS_UPDATED, this.getCurrentPlayers());
  }

  @SubscribeMessage(CS_JOIN_TABLE)
  handleJoinTable(@MessageBody() tableId, @ConnectedSocket() socket: Socket) {
    const table = tables[tableId];
    const player = players[socket.id];
    console.log('tableid====>', tableId, table, player);
    table.addPlayer(player);
    socket.emit(SC_TABLE_JOINED, { tables: this.getCurrentTables(), tableId });
    socket.broadcast.emit(SC_TABLES_UPDATED, this.getCurrentTables());
    this.sitDown(tableId, table.players.length, table.limit, socket.id);

    if (
      tables[tableId].players &&
      tables[tableId].players.length > 0 &&
      player
    ) {
      let message = `${player.name} joined the table.`;
      this.broadcastToTable(table, message);
    }
  }

  @SubscribeMessage(CS_LEAVE_TABLE)
  handleLeaveTable(@MessageBody() tableId, @ConnectedSocket() socket: Socket) {
    const table = tables[tableId];
    const player = players[socket.id];
    const seat: Seat = Object.values<any>(table.seats).find(
      (seat) => seat && seat.player.socketId === socket.id,
    );

    if (seat && player) {
      // TODO: Their original call here sends a player ref and not (amount, socketId)
      // The function looks up the player itself by socketId
      // this.updatePlayerBankroll(player, seat.stack);
      this.updatePlayerBankroll(seat.stack, socket.id);
    }

    table.removePlayer(socket.id);

    socket.broadcast.emit(SC_TABLES_UPDATED, this.getCurrentTables());
    socket.emit(SC_TABLE_LEFT, { tables: this.getCurrentTables(), tableId });

    if (
      tables[tableId].players &&
      tables[tableId].players.length > 0 &&
      player
    ) {
      let message = `${player.name} left the table.`;
      this.broadcastToTable(table, message);
    }

    if (table.activePlayers().length === 1) {
      this.clearForOnePlayer(table);
    }
  }

  @SubscribeMessage(CS_FOLD)
  handleFold(@MessageBody() tableId, @ConnectedSocket() socket: Socket) {
    const table = tables[tableId];
    const res = table.handleFold(socket.id);
    res && this.broadcastToTable(table, res.message);
    res && this.changeTurnAndBroadcast(table, res.seatId);
  }

  @SubscribeMessage(CS_CHECK)
  handleCheck(@MessageBody() tableId, @ConnectedSocket() socket: Socket) {
    const table = tables[tableId];
    const res = table.handleCheck(socket.id);
    res && this.broadcastToTable(table, res.message);
    res && this.changeTurnAndBroadcast(table, res.seatId);
  }

  @SubscribeMessage(CS_CALL)
  handleCall(@MessageBody() tableId, @ConnectedSocket() socket: Socket) {
    const table = tables[tableId];
    const res = table.handleCall(socket.id);
    res && this.broadcastToTable(table, res.message);
    res && this.changeTurnAndBroadcast(table, res.seatId);
  }

  @SubscribeMessage(CS_RAISE)
  handlerRaise(
    @MessageBody() data: { tableId; amount },
    @ConnectedSocket() socket: Socket,
  ) {
    const table = tables[data.tableId];
    const res = table.handleRaise(socket.id, data.amount);
    res && this.broadcastToTable(table, res.message);
    res && this.changeTurnAndBroadcast(table, res.seatId);
  }

  @SubscribeMessage(TABLE_MESSAGE)
  handlerTableMessage(@MessageBody() data: { message; from; tableId }) {
    const table = tables[data.tableId];
    this.broadcastToTable(table, data.message, data.from);
  }

  @SubscribeMessage(CS_REBUY)
  handlerReBuy(
    @MessageBody() data: { tableId; seatId; amount: number },
    @ConnectedSocket() socket: Socket,
  ) {
    const table = tables[data.tableId];
    // const player = players[socket.id];

    table.rebuyPlayer(data.seatId, data.amount);
    // TODO: Their original call here sends a player ref and not (amount, socketId)
    // The function looks up the player itself by socketId
    // this.updatePlayerBankroll(player, -data.amount);
    this.updatePlayerBankroll(-data.amount, socket.id);

    this.broadcastToTable(table);
  }

  @SubscribeMessage(CS_STAND_UP)
  handlerStandUp(@MessageBody() tableId, @ConnectedSocket() socket: Socket) {
    const table = tables[tableId];
    const player = players[socket.id];
    const seat: Seat = Object.values<any>(table.seats).find(
      (seat: any) => seat && seat.player.socketId === socket.id,
    );

    let message = '';
    if (seat) {
      // TODO: Their original call here sends a player ref and not (amount, socketId)
      // The function looks up the player itself by socketId
      // this.updatePlayerBankroll(player, seat.stack);
      this.updatePlayerBankroll(seat.stack, socket.id);
      message = `${player.name} left the table`;
    }

    table.standPlayer(socket.id);

    this.broadcastToTable(table, message);
    if (table.activePlayers().length === 1) {
      this.clearForOnePlayer(table);
    }
  }

  @SubscribeMessage(SITTING_OUT)
  handlerSittingOut(@MessageBody() data: { tableId; seatId }) {
    const table = tables[data.tableId];
    const seat = table.seats[data.seatId];
    seat.sittingOut = true;

    this.broadcastToTable(table);
  }

  @SubscribeMessage(SITTING_IN)
  handlerSittingIn(@MessageBody() data: { tableId; seatId }) {
    const table = tables[data.tableId];
    const seat = table.seats[data.seatId];
    seat.sittingOut = false;

    this.broadcastToTable(table);
    if (table.handOver && table.activePlayers().length === 2) {
      this.initNewHand(table);
    }
  }

  @SubscribeMessage(CS_DISCONNECT)
  handlerDisconnect(@ConnectedSocket() socket: Socket) {
    const seat = this.findSeatBySocketId(socket.id);
    if (seat) {
      this.updatePlayerBankroll(seat.player, seat.stack);
    }

    delete players[socket.id];
    this.removeFromTables(socket.id);

    // TODO: Need to check the intended purpose client side with this
    socket.broadcast.emit(SC_TABLES_UPDATED, this.getCurrentTables());
    socket.broadcast.emit(SC_PLAYERS_UPDATED, this.getCurrentPlayers());

    // this.io.emit(SC_TABLES_UPDATED, this.getCurrentTables());
    // this.io.emit(SC_PLAYERS_UPDATED, this.getCurrentPlayers());
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

  updatePlayerBankroll(amount: number, socketId: string) {
    players[socketId].bankroll += amount;
    this.io.to(socketId).emit(SC_PLAYERS_UPDATED, this.getCurrentPlayers());
  }

  findSeatBySocketId(socketId) {
    let foundSeat: any = null;
    Object.values(tables).forEach((table) => {
      Object.values(table.seats).forEach((seat) => {
        if (seat && seat.player.socketId === socketId) {
          foundSeat = seat;
        }
      });
    });
    return foundSeat;
  }

  removeFromTables(socketId) {
    for (let i = 0; i < Object.keys(tables).length; i++) {
      tables[Object.keys(tables)[i]].removePlayer(socketId);
    }
  }

  broadcastToTable(table: Table, message?: string, from?: string) {
    for (let i = 0; i < table.players.length; i++) {
      let socketId = table.players[i].socketId;
      let tableCopy = this.hideOpponentCards(table, socketId);
      this.io.to(socketId).emit(SC_TABLE_UPDATED, {
        table: tableCopy,
        message,
        from,
      });
    }
  }

  // TODO: This will cause memory leaks if timeout refs aren't cleared over time
  // while the same process continues to run
  changeTurnAndBroadcast(table: Table, seatId) {
    setTimeout(() => {
      table.changeTurn(seatId);
      this.broadcastToTable(table);
      if (table.handOver) {
        this.initNewHand(table);
      }
    }, 1000);
  }

  // TODO: This will cause memory leaks if timeout refs aren't cleared over time
  // while the same process continues to run
  initNewHand(table: Table) {
    if (table.activePlayers().length > 1) {
      this.broadcastToTable(table, '---New hand starting in 5 seconds---');
    }
    setTimeout(() => {
      table.clearWinMessages();
      table.startHand();
      this.broadcastToTable(table, '--- New hand started ---');
    }, 5000);
  }

  // TODO: This will cause memory leaks if timeout refs aren't cleared over time
  // while the same process continues to run
  clearForOnePlayer(table: Table) {
    table.clearWinMessages();
    setTimeout(() => {
      table.clearSeatHands();
      table.resetBoardAndPot();
      this.broadcastToTable(table, 'Waiting for more players');
    }, 5000);
  }

  hideOpponentCards(table: Table, socketId: string) {
    let tableCopy = JSON.parse(JSON.stringify(table));
    let hiddenCard = { suit: 'hidden', rank: 'hidden' };
    let hiddenHand = [hiddenCard, hiddenCard];
    for (let i = 1; i <= tableCopy.maxPlayers; i++) {
      let seat = tableCopy.seats[i];
      if (
        seat &&
        seat.hand.length > 0 &&
        seat.player.socketId !== socketId &&
        !(seat.lastAction === WINNER && tableCopy.wentToShowdown)
      ) {
        seat.hand = hiddenHand;
      }
    }
    return tableCopy;
  }

  getCurrentTables() {
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

  sitDown = (tableId, seatId, amount, socketId) => {
    const table = tables[tableId];
    const player = players[socketId];
    if (player) {
      table.sitPlayer(player, seatId, amount);
      let message = `${player.name} sat down in Seat ${seatId}`;
      this.updatePlayerBankroll(-amount, socketId);
      this.broadcastToTable(table, message);
      if (table.activePlayers().length === 2) {
        this.initNewHand(table);
      }
    }
  };
}
