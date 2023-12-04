const { apiService } = require("../services");
const { StatusCodes } = require("http-status-codes");

const notificationForward = async (req, res) => {
    const { body } = req;
    console.log(body);
    try {
        // const text = '04:49 05/12/2023 Tài khoản thanh toán 3143869298. Số tiền: +50,000VND. Số dư cuối: 16,978,757VND Nội dung giao dịch: REM Tfr Ac:3143869298 O@L_080001_211701_0_0_83712525_NAP VI DIEN TU MOMO_0909307061_49497462177';
        const text = body.text;
        const dateTimeRegex = /(\d{2}:\d{2} \d{2}\/\d{2}\/\d{4})/g;
        const moneyRegex = /(\+|\-)(\d{1,3},)+\d{3}VND/g;
        const transactionCotnentRegex = /Nội dung giao dịch: (.*)/g;

        const dateTime = text.match(dateTimeRegex);
        const money = text.match(moneyRegex);
        const transactionContent = text.match(transactionCotnentRegex);

        if (!dateTime || !money || !transactionContent) {
            return res.status(StatusCodes.BAD_REQUEST).send();
        }
        if (dateTime.length === 0 || money.length === 0 || transactionContent.length === 0) {
            return res.status(StatusCodes.BAD_REQUEST).send();
        }
        if (money[0].startsWith('-')) {
            return res.status(StatusCodes.OK).send();
        }
        const message = `Thời gian: ${dateTime[0]} \nSố tiền: ${money[0]} \n${transactionContent[0]}`;

        console.log(process.env.RECEIVER_EMAILS);
        const receiverEmails = process.env.RECEIVER_EMAILS.split(', ');

        const requests = receiverEmails.map((email) => {
            return apiService.post("https://api.pushbullet.com/v2/pushes", {
                email,
                type: "note",
                title: "Khách chuyển tiền",
                body: message,
            });
        });

        await Promise.all(requests);
    }
    catch (err) {
        console.log(err);
    }
    res.status(StatusCodes.OK).send();
};

module.exports = {
    notificationForward,
};