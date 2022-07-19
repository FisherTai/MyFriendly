# Friendly

**使用TypeScript搭配MERN架構所撰寫的簡易聊天室，未實際上線。**

* 會員功能
* 實時傳訊
* 通訊錄

|   |   |
| ------------ | ------------ |
| DB  | MongoDB  |
| 用戶端  | ReactJS  |
| 伺服器端  |  Node.js、Express |
|  Socket |  Socket.io |


需在專案中創建.env內容:
```
LOCAL_PORT=[Server端的Port]
CLIENT_PORT=[Client端的Port]
MONGO_DB_LOCAL=[本地的MongoDB]
MONGO_DB_LOCAL_REPLICA_SET=[雲端的MongoDB]
SECRET=[JWT所使用的key]
```
