import express from 'express';

const app = express();

const PORT = 3000;

app.head('/keepAlive', (_req, res) => {
    res.send('keeping bot alive.');
});

app.listen(PORT, () => {
    console.log(`API on port ${PORT}`);
});
