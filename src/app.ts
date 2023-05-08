import express from 'express';
import cors from 'cors';
import dingTalkRouter from './routes/dingTalkRouter';
import feishuRouter from './routes/feishuRouter';
import enterpriseWeChatRouter from './routes/enterpriseWeChatRouter';
import pgyerRouter from './routes/pgyerRouter';


const app = express();
const PORT = 7002;

app.use(express.json());
app.use(cors());
app.options('*', cors());

app.use('/dingTalk', dingTalkRouter);
app.use('/feishu', feishuRouter);
app.use('/enterpriseWeChat', enterpriseWeChatRouter);
app.use('/pgyer', pgyerRouter);

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
