import React, { useEffect, useState } from 'react';
import Header from '../Components/Header';
import { Modal } from 'antd';
import Cards from '../Components/Cards';
import AddIncomeModal from '../Components/Modals/addIncome';
import AddExpenseModal from '../Components/Modals/addExpense';
import { addDoc, collection, query, getDocs } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '../firebase'; // Ensure db is imported
import { toast } from 'react-toastify';
import moment from 'moment';
import TransactionTable from '../Components/TransactionTable';
import ChartComponent from '../Components/Charts';
import NoTransactions from '../Components/Notransaction';

const Dashboard = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [user] = useAuthState(auth);
  const [isExpenseModalVisible, setIsExpenseModalVisible] = useState(false);
  const [isIncomeModalVisible, setIsIncomeModalVisible] = useState(false);
  const [income, setIncome] = useState(0);
  const [expense, setExpense] = useState(0);
  const [totalBalance, setTotalBalance] = useState(0);

  const showExpenseModal = () => {
    setIsExpenseModalVisible(true);
  };

  const showIncomeModal = () => {
    setIsIncomeModalVisible(true);
  };

  const handleExpenseCancel = () => {
    setIsExpenseModalVisible(false);
  };

  const handleIncomeCancel = () => {
    setIsIncomeModalVisible(false);
  };

  const onFinish = (values, type) => {
    const newTransaction = {
      id: `${user.uid}-${Date.now()}`, // Ensure a unique ID for each transaction
      type: type,
      date: values.date.format("YYYY-MM-DD"),
      amount: parseFloat(values.amount),
      tag: values.tag,
      name: values.name,
    };

    addTransaction(newTransaction);
  };

  async function addTransaction(transaction,many) {
    try {
      const docRef = await addDoc(
        collection(db, `users/${user.uid}/transactions`),
        transaction
      );
      console.log("Document written with Id:", docRef.id);
      if(!many) toast.success("Transaction Added!");
      setTransactions((prevTransactions) => [...prevTransactions, transaction]); // Properly update state with new transaction
      calculateBalance(); // Recalculate balance after adding transaction
    } catch (e) {
      console.error("Error adding document: ", e);
      if(!many)toast.error("Couldn't add transaction");
    }
  }

  useEffect(() => {
    if (user) {
      fetchTransactions();
    }
  }, [user]);

  async function fetchTransactions() {
    setLoading(true);
    try {
      const q = query(collection(db, `users/${user.uid}/transactions`));
      const querySnapshot = await getDocs(q);
      const transactionsArray = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setTransactions(transactionsArray);
      toast.success("Transactions Fetched!");
    } catch (e) {
      console.error("Error fetching transactions: ", e);
      toast.error("Couldn't fetch transactions");
    }
    setLoading(false);
  }

  useEffect(() => {
    calculateBalance(); // Call calculateBalance as a function
  }, [transactions]);

  const calculateBalance = () => {
    let incomeTotal = 0;
    let expensesTotal = 0;

    transactions.forEach((transaction) => {
      if (transaction.type === "income") {
        incomeTotal += transaction.amount;
      } else {
        expensesTotal += transaction.amount;
      }
    });

    setIncome(incomeTotal);
    setExpense(expensesTotal);
    setTotalBalance(incomeTotal - expensesTotal);
  };
  let sortedTransactions= transactions.sort((a, b) => {

      return new Date(a.date) - new Date(b.date);
    
  });

  return (
    <div>
      <Header />
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <Cards 
            income={income}
            expense={expense}
            totalBalance={totalBalance} // Correct prop name
            showExpenseModal={showExpenseModal}
            showIncomeModal={showIncomeModal}
          />
          {transactions.length!=0?<ChartComponent sortedTransactions={sortedTransactions}/>:<NoTransactions/>}
          <AddExpenseModal
            isExpenseModalVisible={isExpenseModalVisible}
            handleExpenseCancel={handleExpenseCancel}
            onFinish={onFinish}
          />
          <AddIncomeModal
            isIncomeModalVisible={isIncomeModalVisible}
            handleIncomeCancel={handleIncomeCancel}
            onFinish={onFinish}
          />
          <TransactionTable 
          transactions={transactions}
           addTransaction={addTransaction}
           fetchTransactions={fetchTransactions}
           />
        </>
      )}
    </div>
  );
};

export default Dashboard;
