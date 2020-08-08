import { useHistory } from 'react-router-dom';

const historyOb = {
  value: '',
};

function getHistory() {
  return historyOb.value;
}

function setHistory(history) {
  historyOb.value = history;
}

export function useCreateHistory() {
  const history = useHistory();
  setHistory(history);
}

export default getHistory;
