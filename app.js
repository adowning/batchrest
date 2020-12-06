const batchRequest = require("batch-request-js");
const fetch = require("node-fetch").default;
const axios = require("axios").default;
const API_ENDPOINT = "https://api.servicemonster.net/v1";
const options = {
  headers: { Authorization: "Basic NGM4T1JQbk86Q2ppVU1ydHZxZVg0TVN0MA==" },
};
async function getAccountIDList() {
  const idList = [];
  const countResult = await axios.get(
    `${API_ENDPOINT}/accounts?/Fields=accountID`,
    options
  );
  const pageCount = Math.ceil(countResult.data.count / 100);
  for (var i = 0; i < pageCount; i++) {
    idList.push();
    idList.push(`${API_ENDPOINT}/accounts?pageIndex=${i}`);
  }
  return idList;
}

async function getData(pageNumberList) {
  //   console.log(idList);
  //   setup a 100 test records
  const records = Array(2)
    .fill(0)
    .map((d, i) => i);
  const customerIds = ["1", "2", "3"];

  // all requests will succeed and be timestamped
  // define the async request to perform against each data input
  const request = (pageNumber) =>
    fetch(
      `${API_ENDPOINT}/accounts?pageIndex=${pageNumber}&limit=100`,
      options
    ).then((response) => response.json());

  //   const request = (record) =>
  //     Promise.resolve({ ...record, timestamp: Date.now() });
  // batch requests 20 at a time, delaying half a second after each batch request
  //   console.log(records);
  const { error, data } = await batchRequest(records, request, {
    batchSize: 20,
    options: options,
    delay: 500,
  });
  let accounts = [];
  data.forEach((group) => {
    const items = group.items;
    accounts.push(...items);
  });
  accounts = accounts.map((item) => {
    delete item.row_number;
    Object.defineProperty(
      item,
      "id",
      Object.getOwnPropertyDescriptor(item, "accountID")
    );
    delete item["accountID"];
    return item;
  });
  return accounts;

  //   {
  //     error: [],
  //     data: [
  //        { record: 0, timestamp: 1533552890663 },
  //        { record: 1, timestamp: 1533552890663 },
  //        { record: 2, timestamp: 1533552890663 },
  //        { record: 3, timestamp: 1533552890663 },
  //         ...
  //     ]
}

async function getAccountOrders(accounts) {
  //   console.log(accounts[0]);
  //   console.log(accountIDList[0]);
  const records = accounts.map((item) => item.id);
  const request = (accountNumber) =>
    fetch(
      `${API_ENDPOINT}/accounts/${accountNumber}/orders`,
      options
    ).then((response) => response.json());
  const { error, data } = await batchRequest(records, request, {
    batchSize: 20,
    options: options,
    delay: 500,
  });
  let orderIDList = [];
  data.forEach((group) => {
    const items = group.items;
    accounts.orders = items;
    orderIDList.push(...items);
  });

  orderIDList = orderIDList.map((item) => {
    delete item.row_number;
    Object.defineProperty(
      item,
      "id",
      Object.getOwnPropertyDescriptor(item, "orderID")
    );
    delete item["orderID"];
    return item;
  });
  const accountOrders = accounts.forEach((account) => {
    orderIDList.filter((order) => {
      if (account.id == order.accountID) {
        console.log(order.id, account.id);
        return true;
      } else {
        return false;
      }
    });
    accounts = accounts.map((account) => {
      account.orders = [];
      orderIDList.filter((order) => {
        if (account.id == order.accountID) {
          account.orders.push(order);
        } else {
        }
      });
    });
  });

  return { accounts: accounts, orderIDList: orderIDList };
}
getAccountIDList().then((idList) => {
  getData(idList).then((accounts) => {
    getAccountOrders(accounts).then((result) => {
      //   console.log(result);
      const { orderIDList, accounts } = result;
      //   console.log(orderIDList[0]);
      // console.log(accounts[0]);
      //   console.log(accounts[0]);
      //   console.log(orderIDList[0]);
      accounts.forEach((account) => {
        console.log(account.orders);
      });
    });
  });
});
