function createToastManager() {
  let toastMsgQue = $state([]);
  let currentId = $state(0);

  function setToastMsgQueEmpty() {
      toastMsgQue = [];
  }

  function addToastMsgQue(msg = 'Default message', style = 'alert-info') {
      currentId++;
      toastMsgQue = [...toastMsgQue, { id: currentId, msg, style }];
  }

  function removeToastMsg(idToRemove) {
      toastMsgQue = toastMsgQue.filter((msg) => msg.id !== idToRemove);
  }

  return {
      get toastMsgQue() {
          return toastMsgQue;
      },
      setToastMsgQueEmpty,
      addToastMsgQue,
      removeToastMsg
  };
}

export const toastMgr = createToastManager();
