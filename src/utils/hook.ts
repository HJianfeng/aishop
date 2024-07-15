
import { useCallback, useContext, useEffect } from 'react';
import { UNSAFE_NavigationContext as NavigationContext } from 'react-router-dom'
import type { History } from 'history'
import { createBrowserHistory } from 'history';

const history = createBrowserHistory();
export function useBlocker (blocker: any, when = true) {
  // const navigator = useContext(NavigationContext).navigator as History;

  useEffect(() => {
    if (!when) return;

    const unblock = history.block((tx: any) => {
      const autoUnblockingTx = {
        ...tx,
        retry () {
          unblock();
          tx.retry();
        },
      };

      blocker(autoUnblockingTx);
    });

    return unblock;
  }, [blocker, when]);
}

export function usePrompt (message: any, when = true) {
  const { basename } = useContext(NavigationContext);

  const blocker = useCallback(
    (tx: any) => {
      if (typeof message === "function") {
        let targetLocation = tx?.location?.pathname;
        if (targetLocation.startsWith(basename)) {
          targetLocation = targetLocation.substring(basename.length);
        }
        if (message(targetLocation)) {
          tx.retry();
        }
      } else if (typeof message === "string") {
        if (window.confirm(message)) {
          tx.retry();
        }
      }
    },
    [message, basename]
  )
  return useBlocker(blocker, when);
}