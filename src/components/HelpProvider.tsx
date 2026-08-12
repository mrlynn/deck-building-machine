'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import {
  DEFAULT_HELP_TOPIC,
  type HelpTopicId,
  isHelpTopicId,
} from '@/content/help';

type HelpContextValue = {
  open: boolean;
  topicId: HelpTopicId;
  openHelp: (topicId?: HelpTopicId) => void;
  closeHelp: () => void;
};

const HelpContext = createContext<HelpContextValue | null>(null);

function topicFromHash(): HelpTopicId | null {
  if (typeof window === 'undefined') return null;
  const hash = window.location.hash;
  const match = hash.match(/^#help(?:=|\/)([\w-]+)$/);
  if (!match) return null;
  return isHelpTopicId(match[1]) ? match[1] : DEFAULT_HELP_TOPIC;
}

function setHelpHash(topicId: HelpTopicId | null) {
  if (typeof window === 'undefined') return;
  const url = new URL(window.location.href);
  if (topicId) {
    url.hash = `help=${topicId}`;
  } else if (url.hash.startsWith('#help')) {
    url.hash = '';
  }
  window.history.replaceState(null, '', `${url.pathname}${url.search}${url.hash}`);
}

export function HelpProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(() => topicFromHash() !== null);
  const [topicId, setTopicId] = useState<HelpTopicId>(
    () => topicFromHash() ?? DEFAULT_HELP_TOPIC,
  );

  const openHelp = useCallback((nextTopic: HelpTopicId = DEFAULT_HELP_TOPIC) => {
    setTopicId(nextTopic);
    setOpen(true);
    setHelpHash(nextTopic);
  }, []);

  const closeHelp = useCallback(() => {
    setOpen(false);
    setHelpHash(null);
  }, []);

  useEffect(() => {
    const onHashChange = () => {
      const topic = topicFromHash();
      if (topic) {
        setTopicId(topic);
        setOpen(true);
      } else {
        setOpen(false);
      }
    };

    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  const value = useMemo(
    () => ({ open, topicId, openHelp, closeHelp }),
    [open, topicId, openHelp, closeHelp],
  );

  return (
    <HelpContext.Provider value={value}>{children}</HelpContext.Provider>
  );
}

export function useHelp(): HelpContextValue {
  const ctx = useContext(HelpContext);
  if (!ctx) {
    throw new Error('useHelp must be used within HelpProvider');
  }
  return ctx;
}
