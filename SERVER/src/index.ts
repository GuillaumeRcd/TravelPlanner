import express from 'express';
import router from './routes/router';
import cors from 'cors';
import http from 'http';

const PORT = process.env.PORT || 3001;

const app = express();

app.use(cors());
app.use(express.json());
app.use(router);

const server = http.createServer(app);

server.listen(PORT, () => {
  console.log(`server is listenning on http://localhost:${PORT}`);
});

export { server, app };
