import { Sequelize } from "sequelize";

const sequelize = new Sequelize("chat_app", "root", "", {
    dialect: 'mysql',
    host: 'localhost'
});

export default sequelize