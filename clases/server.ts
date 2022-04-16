import express from 'express';
import { SERVER_PORT } from '../global/environment';
import socketIO from "socket.io";
import http from 'http';

import * as socket from "../sockets/socket";

export default class Server {

    private static _instace: Server;

    public app: express.Application;
    public port: number;

    public io: socketIO.Server;
    private httpServer: http.Server;

    private constructor() {
        this.app = express();
        this.port = SERVER_PORT;

        this.httpServer = http.createServer(this.app);

        this.io = new socketIO.Server(this.httpServer, {
            cors: {
                origin: "http://localhost:4200",
                credentials: true
            }
        });

        this.listenSockets();
    }

    public static get instance() {
        return this._instace || ( this._instace = new this() );
    }

    private listenSockets() {

        console.log('Listen connections - sockets');

        this.io.on('connection', client => {

            console.log('Connected client');

            socket.message( client, this.io );
            socket.disconnect( client );
        })
    }

    start( callback: any ) {
        this.httpServer.listen( this.port, callback );
    }
}