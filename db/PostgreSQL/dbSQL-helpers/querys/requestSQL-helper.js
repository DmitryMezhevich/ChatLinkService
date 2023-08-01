const dbRequest = require('../../index');
const sqlQuery = require('./module/queryHelper').queries;

class RequestSQLHelper {
    async getUser(userEmail, userID = null, userName = null) {
        const { rows } = await dbRequest(sqlQuery.getUser, [
            userID,
            userEmail,
            userName,
        ]);

        return rows[0];
    }

    async createDevice(userID, deviceName, deviceNameApp, deviceIP) {
        const { rows } = await dbRequest(sqlQuery.createDevice, [
            userID,
            deviceName,
            deviceNameApp,
            deviceIP,
        ]);

        return rows[0];
    }

    async getUserDevice(deviceID) {
        const { rows } = await dbRequest(sqlQuery.getUserDevice, [deviceID]);
        return rows[0];
    }

    async insertRefreshToken(deviceID, token) {
        await dbRequest(sqlQuery.insertRefreshToken, [deviceID, token]);
    }

    async deleteDevice(device_id) {
        try {
            await dbRequest(sqlQuery.begin);
            await dbRequest(sqlQuery.deleteRefreshToken, [device_id]);
            const { rows } = await dbRequest(sqlQuery.deleteDevice, [
                device_id,
            ]);
            await dbRequest(sqlQuery.commit);

            return rows[0];
        } catch (error) {
            await dbRequest(sqlQuery.rollback);
            throw error;
        }
    }

    async insertNewEmail(email, hashVerifyCode) {
        try {
            await dbRequest(sqlQuery.begin);
            const { rows } = await dbRequest(sqlQuery.insertNewEmail, [email]);
            const userID = rows[0].user_id;
            await dbRequest(sqlQuery.insertVerifyCodeByEmail, [
                userID,
                hashVerifyCode,
            ]);
            await dbRequest(sqlQuery.commit);

            return userID;
        } catch (error) {
            await dbRequest(sqlQuery.rollback);
            throw error;
        }
    }

    async apdateVerifyCodeByEmail(userID, hashVerifyCode) {
        await dbRequest(sqlQuery.apdateVerificationCodeByEmail, [
            userID,
            hashVerifyCode,
        ]);
    }
}

module.exports = new RequestSQLHelper();
